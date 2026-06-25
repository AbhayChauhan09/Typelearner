# Final Unique Output Definitions
output "frontend_ecr_url" {
  value = aws_ecr_repository.frontend_repo.repository_url
}

output "backend_ecr_url" {
  value = aws_ecr_repository.backend_repo.repository_url
}

output "vpc_id" {
  value = aws_vpc.main.id
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.cluster.name
}

output "website_url" {
  description = "The URL to access the TypeLearner application"
  value       = "http://${aws_lb.main.dns_name}"
}