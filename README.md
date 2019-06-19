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
DB_USER="<mysql user>"
DB_HOST="<mysql host>"
DB_PASSWORD="<mysql password>"
DB_NAME="<database name>"
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
## local MySQL 서버 구성
docker-compose up

## local MySQL 서버 제거
docker-compose down

## server 실행
npm start

## dependency 설치
npm install

## test code 실행
npm run test
```

## 사용 module

- [express](https://expressjs.com/ko/)

node 서버 framework입니다. node 서버 개발을 도와줍니다. 대중적으로 많이 사용되는 framework 입니다.

- [Objection.js](https://vincit.github.io/objection.js/)

MySQL DB query를 쉽게 만들수 있도록 합니다. Sequelize에 비하여 Objection.js은 사용하기 쉽고 유연하게 사용가능하다고 합니다.
Sequelize보다는 reference가 많이 없지만 간단한 DB query를 만들기에는 Objection.js이 편할 것으로 보입니다.

- [mocha & chai]()