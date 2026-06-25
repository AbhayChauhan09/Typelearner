provider "aws" {
  region = var.region
}

# 1. Custom VPC
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = { Name = "${var.project_name}-vpc" }
}

# 2. Networking: Internet Gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.main.id
}

# 3. Networking: Public Subnet
resource "aws_subnet" "public_subnet" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true
  availability_zone       = "us-east-1a"
  tags = { Name = "${var.project_name}-public-subnet" }
}

# 4. Networking: Route Table
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id
  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public_subnet.id
  route_table_id = aws_route_table.public_rt.id
}

# 5. Security Group
resource "aws_security_group" "ecs_sg" {
  name   = "typelearner-sg"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

 
resource "aws_ecr_repository" "app_repository" {
  name = "${var.project_name}-repository"
}

# 7. ECS Cluster
resource "aws_ecs_cluster" "cluster" {
  name = "${var.project_name}-cluster"
}

# 8. ECS Task Definition
resource "aws_ecs_task_definition" "app_task" {
  family                   = "typelearner-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = "arn:aws:iam::860102180300:role/ecsTaskExecutionRole"

  container_definitions = jsonencode([
    {
      name  = "typelearner-container"
      image = "${aws_ecr_repository.app_repo.repository_url}:latest"
      portMappings = [
        {
          containerPort = 80
          hostPort      = 80
        }
      ]
    }
  ])
}

# 9. ECS Service
resource "aws_ecs_service" "app_service" {
  name            = "typelearner-service"
  cluster         = aws_ecs_cluster.cluster.id
  task_definition = aws_ecs_task_definition.app_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = [aws_subnet.public_subnet.id]
    assign_public_ip = true
    security_groups  = [aws_security_group.ecs_sg.id]
  }
}