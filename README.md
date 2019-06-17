# api server 구성하기

## [기본 설치 및 cafe24 구성](https://github.com/yogae/cafe24-node-base-setting.git)

## 실행 방법

1. git 설정(처음 한번만 실행하면 됩니다.)

```bash

git clone https://github.com/yogae/node-jwt-mysql.git

git remote remove origin

# 아래의 명령은 "기본 설치 및 cafe24 구성" "cafe24 node.js hosting 구성하기" 5번 "cafe24 git 설정"에서 저정소의 주소를 입력하시면 됩니다.(입력 시 주소 앞에 있는 git이라는 단어는 빼고 입력합니다.)
git remote add origin <위의 이미지에 있는 저장소에 적혀있는 주소 입력>
``` 

2. .env.example 파일 수정

```
ID="<cafe24 id>"
PASSWORD="<cafe24 password>"
```

3. .env.example을 .env로 파일 이름 변경

4. .gitignore file 제거

5. dependencies 설치

``` bash
npm install
```
6. cafe 24에 upload

``` bash
git add .
git commit -m "<수정된 message 입력>"
git push origin master
```

## 사용법

```bash

## server 실행

npm start

## dependency 설치

npm install

```

