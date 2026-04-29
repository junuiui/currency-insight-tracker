# 1. ZIP get_rates_handler
data "archive_file" "get_rates_zip" {
    type = "zip"
    source_file = "${path.module}/../back/src/get_rates_handler.py"
    output_path = "${path.module}/get_rates.zip"
}

# 2. ZIP write_rates_handler 
data "archive_file" "write_rates_zip" {
    type        = "zip"
    source_dir  = "${path.module}/../back/src" 
    output_path = "${path.module}/write_rates.zip"
    
    # 불필요한 파일 제외 (선택 사항)
    excludes    = ["get_rates_handler.py", "scripts/"]
}

# 3. IAM Role (기존과 동일)
resource "aws_iam_role" "lambda_role" {
    name = "currency_tracker_lambda_role"

    assume_role_policy = jsonencode({
        Version = "2012-10-17"
        Statement = [{
            Action = "sts:AssumeRole"
            Effect = "Allow"
            Principal = { Service = "lambda.amazonaws.com" }
        }]
    })
}

# 4. Lambda: Get Rates (조회용)
resource "aws_lambda_function" "get_rates" {
    filename      = data.archive_file.get_rates_zip.output_path
    function_name = "get-rates-api"
    role          = aws_iam_role.lambda_role.arn
    handler       = "get_rates_handler.lambda_handler" # 파일명.함수명
    runtime       = "python3.13"

    source_code_hash = data.archive_file.get_rates_zip.output_base64sha256

    environment {
        variables = {
            DYNAMODB_TABLE  = "CurrencyRates"
            AWS_REGION_NAME = "us-west-2"
        }
    }
}

# 5. Lambda: Write Rates (수집용)
resource "aws_lambda_function" "write_rates" {
    filename      = data.archive_file.write_rates_zip.output_path
    function_name = "write-rates-collector"
    role          = aws_iam_role.lambda_role.arn
    handler       = "write_rates_handler.lambda_handler"
    runtime       = "python3.13"
    timeout       = 60

    source_code_hash = data.archive_file.write_rates_zip.output_base64sha256

    environment {
        variables = {
            DYNAMODB_TABLE    = "CurrencyRates"
            TARGET_CURRENCIES = "KRW,USD,JPY,EUR,CAD"
            AWS_REGION_NAME   = "us-west-2"
        }
    }
}

# event bridge
# 1. EventBridge: 매일 자정(UTC)에 데이터 수집 실행
resource "aws_cloudwatch_event_rule" "daily_collect" {
    name                = "daily-currency-collection"
    description         = "Collect currency rates every day"
    schedule_expression = "cron(0 0 * * ? *)" 
}

resource "aws_cloudwatch_event_target" "target_lambda" {
    rule      = aws_cloudwatch_event_rule.daily_collect.name
    target_id = "write_rates_lambda"
    arn       = aws_lambda_function.write_rates.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
    statement_id  = "AllowExecutionFromEventBridge"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.write_rates.function_name
    principal     = "events.amazonaws.com"
    source_arn    = aws_cloudwatch_event_rule.daily_collect.arn
}

# 1. HTTP API 생성
resource "aws_apigatewayv2_api" "http_api" {
    name          = "currency-tracker-http-api"
    protocol_type = "HTTP"

    # CORS 설정을 여기서 한 방에 끝냅니다.
    cors_configuration {
        allow_origins = ["*"] # 실제 배포 시에는 CloudFront 도메인만 넣는 것을 권장합니다.
        allow_methods = ["GET", "OPTIONS"]
        allow_headers = ["content-type", "authorization"]
        max_age       = 300
    }
}

# 2. 스테이지 설정 (Auto Deploy 활성화)
resource "aws_apigatewayv2_stage" "default" {
    api_id      = aws_apigatewayv2_api.http_api.id
    name        = "$default" # HTTP API에서는 $default가 가장 관리하기 편합니다.
    auto_deploy = true
}

# 3. 통합 (Lambda와 연결)
resource "aws_apigatewayv2_integration" "lambda_integration" {
    api_id           = aws_apigatewayv2_api.http_api.id
    integration_type = "AWS_PROXY"
    integration_uri  = aws_lambda_function.get_rates.invoke_arn
}

# 4. 라우팅 (경로 설정)
resource "aws_apigatewayv2_route" "get_rates_route" {
    api_id    = aws_apigatewayv2_api.http_api.id
    route_key = "GET /get-rates-api"
    target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# 5. Lambda 권한 부여 (HTTP API용으로 수정)
resource "aws_lambda_permission" "api_gw_permission" {
    statement_id  = "AllowExecutionFromHttpApi"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.get_rates.function_name
    principal     = "apigateway.amazonaws.com"
    source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

# DynamoDB 접근 및 로그 생성을 위한 인라인 정책
resource "aws_iam_role_policy" "lambda_dynamo_logs" {
    name = "lambda_dynamo_logs_policy"
    role = aws_iam_role.lambda_role.id

    policy = jsonencode({
        Version = "2012-10-17"
        Statement = [
        {
            Action = [
            "dynamodb:PutItem",
            "dynamodb:GetItem",
            "dynamodb:Query",
            "dynamodb:Scan"
            ]
            Effect   = "Allow"
            Resource = "arn:aws:dynamodb:us-west-2:*:table/CurrencyRates"
        },
        {
            Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
            ]
            Effect   = "Allow"
            Resource = "arn:aws:logs:*:*:*"
        }
        ]
    })
}