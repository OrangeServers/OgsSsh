# OgsSsh

### 简介
orangeservers的web终端项目，整体部署和展示文档在[OgsDocument](https://github.com/OrangeServers/OgsDocument)

项目借用开源项目[webssh](https://github.com/huashengdun/webssh)开源项目修改而成

### 部署

只能配合orangeservers其他组件才能正常使用，不建议单独部署（单独部署无法正常使用）

```shell
# 下载服务压缩包
git clone https://github.com/OrangeServers/OgsSsh.git
cd OgsSsh

# 安装python包文件
pip3 install -r requirements.txt

# 启动服务
python3 run.py
```

