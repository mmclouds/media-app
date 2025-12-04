# Next.js API 路由参数类型错误修复说明

## 问题分析

在构建过程中，我们遇到了以下类型错误：

```
Type '{ __tag__: "GET"; __param_position__: "second"; __param_type__: { params: { taskId?: string | undefined; }; }; }' does not satisfy the constraint 'ParamCheck<RouteContext>'.
  The types of '__param_type__.params' are incompatible between these types.
    Type '{ taskId?: string | undefined; }' is missing the following properties from type 'Promise<any>': then, catch, finally, [Symbol.toStringTag]
```

这个错误发生在 `src/app/api/media/result/[taskId]/route.ts` 文件中。

## 错误原因

通过分析 `.next/types` 目录下生成的类型文件，我们发现 Next.js 15 对动态路由参数的类型定义发生了变化。在新版本中，路由上下文参数的 `params` 属性应该是一个 `Promise<SegmentParams>` 类型，而不是直接的参数对象。

原来的代码：
```typescript
export async function GET(
  request: NextRequest,
  context: { params: { taskId?: string } }
) {
```

Next.js 期望的类型：
```typescript
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ taskId?: string }> }
) {
```

## 解决方案

我们进行了两处修改：

1. **更新参数类型定义**：
   ```typescript
   export async function GET(
     request: NextRequest,
     context: { params: Promise<{ taskId?: string }> }
   ) {
   ```

2. **正确解构参数**：
   ```typescript
   const params = await context.params;
   const taskId = params?.taskId;
   ```

由于 `params` 现在是一个 Promise，我们需要使用 `await` 来获取实际的参数值。

## 修复验证

运行 `pnpm build` 命令后，项目成功构建，不再出现之前的类型错误。

## 总结

这个错误反映了 Next.js 在类型安全方面的改进。随着框架的发展，对于动态路由参数的处理变得更加严格，要求开发者正确处理异步参数解析。这样的改进有助于避免潜在的运行时错误，提高应用的稳定性。