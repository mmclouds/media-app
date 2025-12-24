# 积分消费接口实现讲解

## 接口概述

创建了一个新的 API 路由 `/api/custom/credits/consume`，用于外部系统调用消费用户积分。

### 接口信息
- **路径**: `/api/custom/credits/consume`
- **方法**: GET
- **认证**: Basic Auth（使用环境变量 `CRON_JOBS_USERNAME` 和 `CRON_JOBS_PASSWORD`）

### 请求参数
| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| userId | string | 是 | 用户ID |
| amount | number | 是 | 消费积分数量（正整数） |
| description | string | 是 | 消费描述 |

### 响应格式
```json
{
  "successFlag": true,
  "message": "Credits consumed successfully",
  "userId": "xxx",
  "amount": 10,
  "description": "xxx"
}
```

### 错误响应
```json
{
  "successFlag": false,
  "message": "错误信息",
  "userId": "xxx",
  "amount": 10,
  "description": "xxx"
}
```

---

## 🟦 A. React 核心概念讲解

本次代码是纯后端 API 路由，不涉及 React 组件和 Hooks。

---

## 🟦 B. Next.js 核心概念讲解

### 1. App Router 的 API 路由机制

Next.js 13+ 使用 App Router，API 路由通过 `route.ts` 文件定义：

```
src/app/api/custom/credits/consume/route.ts
         ↓
映射到 /api/custom/credits/consume
```

**关键点**：
- 文件必须命名为 `route.ts`（不是 `page.ts`）
- 导出的函数名对应 HTTP 方法：`GET`、`POST`、`PUT`、`DELETE` 等
- 函数接收 `Request` 对象作为参数

### 2. Route Handler 导出规范

```typescript
export async function GET(request: Request) {
  // 处理 GET 请求
}
```

- **异步函数**: API 路由通常需要异步操作（数据库、外部 API）
- **Request 对象**: Web 标准的 Request 对象，包含请求信息
- **返回值**: 必须返回 `Response` 或 `NextResponse` 对象

### 3. NextResponse 的使用

```typescript
// JSON 响应
return NextResponse.json({ data: 'xxx' }, { status: 200 });

// 自定义响应（需要设置 headers）
return new NextResponse(JSON.stringify({ ... }), {
  status: 401,
  headers: {
    'Content-Type': 'application/json',
    'WWW-Authenticate': 'Basic realm="Secure Area"',
  },
});
```

### 4. URL 参数解析

```typescript
const { searchParams } = new URL(request.url);
const userId = searchParams.get('userId');
```

- 使用 Web 标准 `URL` API 解析查询参数
- `searchParams.get()` 返回 `string | null`

---

## 🟦 C. 代码逻辑拆解与架构说明

### 1. 文件结构

```
src/app/api/custom/credits/consume/route.ts
├── validateBasicAuth()    # 认证函数
└── GET()                  # 路由处理函数
```

### 2. 认证流程

```
请求 → 提取 Authorization Header → Base64 解码 → 比对环境变量
                ↓
        认证失败返回 401
                ↓
        认证成功继续处理
```

### 3. 参数验证流程

```
解析 URL 参数
    ↓
验证 userId (必填)
    ↓
验证 amount (必填 + 正数)
    ↓
验证 description (必填)
    ↓
调用 consumeCredits()
```

### 4. 错误处理策略

| 场景 | HTTP 状态码 | successFlag |
|------|------------|-------------|
| 认证失败 | 401 | false |
| 参数缺失/无效 | 400 | false |
| 积分不足 | 400 | false |
| 成功 | 200 | true |

### 5. 与现有代码的集成

复用了 `consumeCredits` 函数的完整逻辑：
- FIFO 积分消费（先过期先消费）
- 余额检查
- 交易记录写入
- 用户余额更新

---

## 🟦 D. 初学者学习重点总结

### Next.js API 路由
- [ ] `route.ts` 文件的命名约定
- [ ] HTTP 方法与导出函数名的映射关系
- [ ] `NextResponse.json()` 的使用
- [ ] URL 参数解析方法

### HTTP 认证
- [ ] Basic Auth 的工作原理
- [ ] Authorization Header 格式：`Basic base64(username:password)`
- [ ] 401 响应的 WWW-Authenticate Header

### API 设计最佳实践
- [ ] 统一的响应格式（successFlag）
- [ ] 详细的错误信息返回
- [ ] 参数验证前置
- [ ] 日志记录便于调试

### 调用示例

```bash
# 使用 curl 调用
curl -X GET \
  "http://localhost:3000/api/custom/credits/consume?userId=user123&amount=10&description=test" \
  -H "Authorization: Basic $(echo -n 'username:password' | base64)"
```

```javascript
// 使用 fetch 调用
const credentials = btoa('username:password');
const response = await fetch(
  '/api/custom/credits/consume?userId=user123&amount=10&description=test',
  {
    headers: {
      'Authorization': `Basic ${credentials}`
    }
  }
);
const data = await response.json();
console.log(data.successFlag); // true or false
```
