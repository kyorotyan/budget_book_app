FROM nginx:latest

# HTMLを配置
COPY index.html /usr/share/nginx/html/index.html

# 80番ポートを公開
EXPOSE 80