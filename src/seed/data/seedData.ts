import { Post, Task } from "@prisma/client";
import { v4 as uuid } from 'uuid';
enum TaskStatus {
  pending = 'pending',
  onHold = 'onHold',
  inProgress = 'inProgress',  
  underReview = 'underReview',
  completed = 'completed',
}
export function generateSeedData(): { posts: Post[]; tasks: Task[] } {
  const posts: Post[] = [];
  const tasks: Task[] = [];

  for (let i = 1; i <= 10; i++) {
    const postID = uuid();
    const postTitle = `Post ${i}`;
    const postContent = `Content of Post ${i}`;
    const clientName = `Client of Post ${i}`;

    posts.push({
      id: postID,
      title: postTitle,
      content: postContent,
      clientName: clientName,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const numTasks = Math.floor(Math.random() * 4) + 2;

    for (let j = 1; j <= numTasks; j++) {
      const taskID = uuid();
      const taskName = `Task ${j} of Post ${i}`;
      const taskDescription = `Description of Task ${j} of Post ${i}`;
      const randomStatusIndex = Math.floor(Math.random() * Object.keys(TaskStatus).length);
      const taskStatus: TaskStatus = Object.values(TaskStatus)[randomStatusIndex]; 

      tasks.push({
        id: taskID,
        name: taskName,
        description: taskDescription,
        postId: postID, 
        taskStatus: taskStatus, 
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
  }

  return { posts, tasks };
}

