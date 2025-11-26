# 易热搜 (Easy Hot Search)

全网热搜聚合平台，支持多平台热搜榜单查看与订阅管理。本项目开源免费，禁止商用。

## 提交代码使用dev开发分支。
## 生成方式keytool
Keytool 是 Java JDK 中包含的命令行工具。

要生成密钥存储，请执行下面的命令，“更改”和“使其与你的应用相关。工具会要求你输入一个密钥存储密码和一个密钥密码。请注意这些数值，因为添加你的凭证到Appflow时你会需要它们。MY-RELEASE-KEYMY_ALIAS_NAME

``` bash
$ keytool -genkey -v -keystore MY-RELEASE-KEY.keystore -alias MY_ALIAS_NAME -keyalg RSA -keysize 2048 -validity 10000 -storetype jks
```

## 开发环境运行

1. 安装依赖:
```bash
npm install
```

2. 启动开发:
```bash
npm run dev 
```

## 打包构建 App (Android / iOS)

本项目建议使用 **Capacitor** 将 Web 应用打包为原生 Android 或 iOS 应用。

### 1. 构建 Web 资源

在进行原生打包前，必须先生成 Web 项目的静态资源文件：

```bash
npm run build
```

> 提示：如果你的项目使用的是 Vite，构建产物通常在 `dist` 目录；如果是 Create React App，通常在 `build` 目录。

### 2. 初始化环境 (首次运行)

如果尚未安装 Capacitor 相关依赖，请执行：

```bash
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
```

初始化 Capacitor 项目（注意根据实际构建目录修改 `--web-dir`）：

```bash
npx cap init "易热搜" com.easysearch.app --web-dir dist
```

### 3. 添加原生平台

```bash
# 添加 Android 平台支持
npx cap add android

# 添加 iOS 平台支持 (仅限 macOS 环境)
npx cap add ios
```

### 4. 同步资源

每次修改 React 代码并运行 `npm run build` 后，都需要运行此命令将新代码同步到原生项目中：

```bash
npx cap sync
```

### 5. 打开 IDE 进行打包

**Android:**

```bash
npx cap open android
```
* 命令会启动 Android Studio。
* 等待 Gradle Sync 完成。
* 点击菜单栏 `Build` -> `Generate Signed Bundle / APK` 生成 APK 安装包。

**iOS:**

```bash
npx cap open ios
```
* 命令会启动 Xcode。
* 连接 iPhone 或选择模拟器。
* 在 Signing & Capabilities 中配置签名团队。
* 点击菜单栏 `Product` -> `Archive` 进行归档发布。

## 常见问题

*   **Logo 修改**: 请在 `android/app/src/main/res` 或 `ios/App/App/Assets.xcassets` 中替换图标资源。
*   **网络权限**: Capacitor 默认配置通常包含网络权限，如遇请求失败，请检查 `AndroidManifest.xml` 是否包含 `<uses-permission android:name="android.permission.INTERNET" />`。
