# src/routes/index.js

File này định nghĩa các **tuyến đường (routes)** công khai của ứng dụng React.

## Chức năng

-   Import cấu hình đường dẫn từ `~/config/routes`.
-   Import các component trang để gán cho từng đường dẫn.
-   Xuất ra mảng `publicRoutes` để App.js hoặc Router chính sử dụng.

## Nội dung chính

```js
import routesConfig from '~/config/routes';
import Home from '~/user/component/pages/Home';

const publicRoutes = [
  { path: routesConfig.home, component: Home } //mẫu
  ... // viết tiếp ở đây
];

export { publicRoutes };
```
