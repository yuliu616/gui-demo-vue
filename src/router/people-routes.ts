let people_routes = [
  {
    path: '/people',
    name: 'People',
    component: ()=>import('@/views/people/PeopleHome.vue'),
    redirect: '/people/list',
    children: [
      {
        path: 'list',
        name: 'People List',
        component: ()=>import('@/views/people/PeopleList.vue'),
      },
      {
        path: 'item/:id/view',
        name: 'People View',
        component: ()=>import('@/views/people/PeopleView.vue'),
      },
      {
        path: 'item/:id/edit',
        name: 'People Editor',
        component: ()=>import('@/views/people/PeopleEditor.vue'),
      },
      {
        path: 'creation',
        name: 'Add People',
        component: ()=>import('@/views/people/PeopleEditor.vue'),
      },
    ],
  },
];

export { people_routes };
