import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/app/components/ui/card";

interface Post {
  id: number;
  title: string;
  body: string;
}

/**
 * Server component that fetches data from an API
 */
async function fetchPosts(): Promise<Post[]> {
  // Simulate slower connection to demonstrate suspense
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  const res = await fetch("https://jsonplaceholder.typicode.com/posts?_limit=3", {
    // Ensure data is fresh for 60 seconds
    next: { revalidate: 60 }
  });
  
  if (!res.ok) {
    throw new Error("Failed to fetch posts");
  }
  
  return res.json();
}

export async function DataDisplay() {
  const posts = await fetchPosts();
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardHeader>
            <CardTitle className="line-clamp-1">{post.title}</CardTitle>
            <CardDescription>Post ID: {post.id}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3 text-sm">{post.body}</p>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Data fetched via RSC
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 