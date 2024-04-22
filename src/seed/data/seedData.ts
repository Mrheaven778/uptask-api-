// import { Post, Task, User } from "@prisma/client";
// import { v4 as uuid } from 'uuid';
// enum TaskStatus {
//   pending = 'pending',
//   onHold = 'onHold',
//   inProgress = 'inProgress',  
//   underReview = 'underReview',
//   completed = 'completed',
// }
// export function generateSeedData(): { users: User[]; posts: Post[]; tasks: Task[] } {
//   const users: User[] = [];
//   const posts: Post[] = [];
//   const tasks: Task[] = [];

//   // Generate test users
//   for (let i = 1; i <= 3; i++) {
//     const userID = uuid();
//     const userEmail = `user${i}@example.com`;
//     const username = `user${i}`;
//     const password = `password${i}`;

//     users.push({
//       id: userID,
//       email: userEmail,
//       username: username,
//       password: password,
//       isActivated: true,
//       createdAt: new Date(),
//       updatedAt: new Date(),
//       roles: ['user']
//     });
//   }

//   // Generate test posts and tasks
//   for (let i = 1; i <= 10; i++) {
//     const postID = uuid();
//     const postTitle = `Proyecto ${i}`;
//     const postContent = `Content of Proyecto ${i}`;
//     const clientName = `Client of Proyecto ${i}`;

//     let managerId;
//     let attempts = 0; // Contador de intentos para evitar bucles infinitos
//     const maxAttempts = 10; // Límite de intentos para evitar bucles infinitos
//     let isManagerIdUsed;

//     // Seleccionar un managerId único
//     do {
//       managerId = users[Math.floor(Math.random() * users.length)].id;
//       attempts++;

//       // Agregar log para depurar
//       console.log(`Attempt ${attempts}: Selected managerId ${managerId}`);

//       // Verificar si el managerId ya está en uso
//       isManagerIdUsed = posts.some(post => post.managerId === managerId);

//       // Si se supera el límite de intentos, detener el bucle
//       if (attempts >= maxAttempts) {
//         console.error(`Exceeded max attempts to find unique managerId for post ${postID}`);
//         break;
//       }
//     } while (isManagerIdUsed);

//     // Agregar post si se encontró un managerId único
//     if (!isManagerIdUsed) {
//       posts.push({
//         id: postID,
//         title: postTitle,
//         content: postContent,
//         clientName: clientName,
//         createdAt: new Date(),
//         updatedAt: new Date(),
//         managerId: managerId,
//       });

//       // Generar tareas para el post
//       const numTasks = Math.floor(Math.random() * 4) + 2;
//       for (let j = 1; j <= numTasks; j++) {
//         const taskID = uuid();
//         const taskName = `Task ${j} of Post ${i}`;
//         const taskDescription = `Description of Task ${j} of Post ${i}`;
//         const randomStatusIndex = Math.floor(Math.random() * Object.keys(TaskStatus).length);
//         const taskStatus: TaskStatus = Object.values(TaskStatus)[randomStatusIndex]; 

//         tasks.push({
//           id: taskID,
//           name: taskName,
//           description: taskDescription,
//           postId: postID, 
//           taskStatus: taskStatus, 
//           createdAt: new Date(),
//           updatedAt: new Date(),
//         });
//       }
//     }
//   }

//   return { users, posts, tasks };
// }

