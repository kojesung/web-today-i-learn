# DB - 실습

## DDL 실습

### 문제 1: 테이블 생성하기

1. attendance 테이블은 중복된 데이터가 쌓이는 구조이다. 중복된 데이터는 어떤 컬럼인가?
    - `crew_id`, `nickname`이 중복된다.


2. attendance 테이블에서 중복을 제거하기 위해 crew 테이블을 만들려고 한다. 어떻게 구성해 볼 수 있을까?
   - 크루의 고유 정보를 관리하는 테이블로, `crew_id`와 `nickname` 컬럼으로 구성한다.


3. crew 테이블에 들어가야 할 크루들의 정보는 어떻게 추출할까? (hint: DISTINCT)
    - 중복 제거를 위해 `DISTINCT`를 사용한다.

```mysql
SELECT DISTINCT crew_id, nickname FROM attendance; 
```


4. 최종적으로 crew 테이블 생성:

```mysql
CREATE TABLE crew (
    `crew_id`  INT          NOT NULL,
    `nickname` VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`crew_id`)
);
```


5. attendance 테이블에서 크루 정보를 추출해서 crew 테이블에 삽입하기:

```mysql
INSERT INTO crew (crew_id, nickname)
SELECT DISTINCT crew_id, nickname
FROM attendance;
```


### 문제 2: 테이블 컬럼 삭제하기

1. crew 테이블을 만들고 중복을 제거했다. attendance에서 불필요해지는 컬럼은?
    - `nickname` (crew 테이블에서 관리하므로 중복됨)


2. 컬럼을 삭제하려면 어떻게 해야 하는가?

```mysql
ALTER TABLE attendance DROP COLUMN nickname;
```

### 문제 3: 외래키 설정하기

- `attendance` 테이블이 `crew` 테이블을 참조하도록 설정

```mysql
ALTER TABLE attendance 
ADD FOREIGN KEY (crew_id) 
REFERENCES crew(crew_id);
```

### 문제 4: 유니크 키 설정

- 닉네임 중복 방지를 위한 제약 조건

```mysql
ALTER TABLE crew
ADD UNIQUE (nickname);
```

## DML (CRUD) 실습

### 문제 5: 크루 닉네임 검색하기
```mysql
SELECT nickname
FROM crew
WHERE nickname LIKE '디%';
```

### 문제 6: 출석 기록 확인하기
```mysql
SELECT crew_id
FROM crew
WHERE nickname = '어셔';
```
> `LIKE`는 패턴 매칭 연산자로, `%`나 `_` 없이 사용하면 `=`와 동일하게 동작하긴 하지만 의미상 부정확한 사용이다. 정확한 일치 검색이므로 `=`이 적절하다.

=> 조회 결과가 없으므로 해당 크루는 존재하지 않음

### 문제 7: 누락된 출석 기록 추가
```mysql
INSERT INTO crew (crew_id, nickname)
VALUES (13, '어셔');

INSERT INTO attendance (crew_id, attendance_date, start_time, end_time)
VALUES (13, '2025-03-06', '09:31', '18:01');
```

### 문제 8: 잘못된 출석 기록 수정
```mysql
INSERT INTO crew (crew_id, nickname) 
VALUES (14, '주니');
```

주니 추가

```mysql
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time) 
VALUES (14, '2025-03-12', '10:05', '18:00'); 
```

주니 출석 추가

```mysql
UPDATE attendance
SET start_time = '10:00'
WHERE crew_id = 14 AND attendance_date = '2025-03-12';
```

주니 출석 갱신

=> 잘못 입력된 등교 시간을 수정

### 문제 9: 허위 출석 기록 삭제

```mysql
INSERT INTO crew (crew_id, nickname) 
VALUES (15, '아론');
```

```mysql
INSERT INTO attendance (crew_id, attendance_date, start_time, end_time) 
VALUES (15, '2025-03-12', '10:00', '18:00'); 
```

```mysql
DELETE FROM attendance
WHERE crew_id = 15 AND attendance_date = '2025-03-12';
```

=> 잘못된(허위) 출석 기록 삭제

### 문제 10: 출석 정보 조회하기

```mysql
SELECT c.nickname, a.attendance_date, a.start_time, a.end_time
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id;
```

### 문제 11: nickname으로 쿼리 처리하기
```mysql
SELECT * FROM attendance 
WHERE crew_id = ( SELECT crew_id FROM crew WHERE nickname = '검프' );
```

### 문제 12: 가장 늦게 하교한 크루 찾기
```mysql
SELECT c.nickname, a.end_time
FROM crew AS c
INNER JOIN attendance AS a ON c.crew_id = a.crew_id
WHERE a.attendance_date = '2025-03-05'
ORDER BY a.end_time DESC
LIMIT 1;
```

## 집계 함수 실습

### 문제 13: 크루별로 '기록된' 날짜 수 조회
```mysql
SELECT crew_id, COUNT(attendance_date)
FROM attendance
GROUP BY crew_id;
```

### 문제 14: 크루별로 등교 기록이 있는 (start_time IS NOT NULL) 날짜 수 조회
```mysql
SELECT crew_id, COUNT(attendance_date)
FROM attendance
WHERE start_time IS NOT NULL
GROUP BY crew_id;
```

### 문제 15: 날짜별로 등교한 크루 수 조회
```mysql
SELECT attendance_date, COUNT(crew_id)
FROM attendance
GROUP BY attendance_date;
```

### 문제 16: 크루별 가장 빠른 등교 시각(MIN)과 가장 늦은 등교 시각(MAX)
```mysql
SELECT crew_id, MIN(start_time), MAX(start_time)
FROM attendance
GROUP BY crew_id;
```
