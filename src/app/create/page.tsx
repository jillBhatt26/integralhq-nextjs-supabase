import PostForm from '@/components/PostForm';

const CreatePostPage = () => {
    return (
        <div className="container mx-auto my-8 lg:my-14">
            <h1 className="text-center text-2xl text-gray-300">
                Create new post
            </h1>

            <PostForm purpose="create" />
        </div>
    );
};

export default CreatePostPage;
