let product_routes = [
  {
    path: '/product',
    name: 'Product',
    component: ()=>import('@/views/product/ProductHome.vue'),
    redirect: '/product/list',
    children: [
      {
        path: 'list',
        name: 'Product List',
        component: ()=>import('@/views/product/ProductList.vue'),
      },
      {
        path: 'item/:id/view',
        name: 'Product View',
        component: ()=>import('@/views/product/ProductView.vue'),
      },
      {
        path: 'item/:id/edit',
        name: 'Product Editor',
        component: ()=>import('@/views/product/ProductEditor.vue'),
      },
      {
        path: 'creation',
        name: 'Add Product',
        component: ()=>import('@/views/product/ProductEditor.vue'),
      },
      {
        path: 'brand-list',
        name: 'Brand List',
        component: ()=>import('@/views/product/BrandList.vue'),
      },
    ],
  },
];

export { product_routes };
