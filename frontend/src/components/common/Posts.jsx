import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";

import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react";

const Posts = ({ feedType }) => {

	const getPostEndpoint = (feedType) => {
		switch(feedType){
			case "forYou":
				return "/api/post/all";
			
			case "following":
				return "/api/post/all/followingposts";
			
			default:
				return "/api/post/all";
		}
	}

	const POST_ENDPOINT = getPostEndpoint(feedType);

	const { data:posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try{
				const res = await fetch(POST_ENDPOINT, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					}
				});

				const data = await res.json();
				if(!res.ok){
					throw new Error(data.error || "Something went wrong");
				}
				
				console.log(data);
				return data;
			}
			catch(err){
				throw new Error(err.message);
			}
		}
	})

	useEffect(() => {
		refetch();
	}, [feedType])

	return (
		<>
			{(isLoading || isRefetching) && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;