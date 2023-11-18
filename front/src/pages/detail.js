import React from "react";
import { useQuery } from 'react-query'
import axios from "axios"
import { Loader, Alert, Table, Pagination, ActionIcon, Modal } from '@mantine/core';
import { IconInfoCircle } from "@tabler/icons-react";



const Detail = (props) => {
    const API_BASE_URL = "http://localhost:5000/articles"


    const fetchItems = async () => {
        return await axios.get(`${API_BASE_URL}/${props.id}`);
    };
    const queryArticle = useQuery(`article${props.id}`, fetchItems);
    const { data: Article, isLoading: isArticleLoading, error: ArticleError } = queryArticle
    const refetch = () => {
        queryArticle.refetch();

    };
    if (isArticleLoading) return (<Loader color="blue" />)


    if (ArticleError) return (<Alert variant="light" color="red" title="Problem" icon={IconInfoCircle}>
        {ArticleError.message}
    </Alert>)

    return <code>
        <pre>
            {JSON.stringify(Article.data, null, 2)}

        </pre>
    </code>
}

export default Detail
