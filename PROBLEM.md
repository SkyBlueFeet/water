# problem

#### nodemon 占用端口

```bash
lsof -i tcp:8080 # 查询占用端口的进程
kill -9 {{ processID }} # 关闭进程
```

#### openssl 生成秘钥

```bash
openssl genrsa -out rsa_private_key.pem 2048 # 生成秘钥
openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem # 生成公钥
```
