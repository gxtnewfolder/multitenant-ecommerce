interface Props {
    params: Promise<{ 
        category: string,
        subcategory: string
    }>;
}

const Page = async ({ params }: Props) => {
    const { category, subcategory } = await params;

    return (
        <div>
            <h1>{category} - {subcategory}</h1>
        </div>
    )
}

export default Page;