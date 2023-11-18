import React, { useState, useEffect } from "react";
import { useQuery } from 'react-query'
import axios from "axios"
import { Loader, Alert, Table, Pagination, ActionIcon, Modal, Group, Button, TextInput, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

import { IconArrowsMoveVertical, IconBook, IconEdit, IconHeart, IconInfoCircle, IconTrashFilled } from '@tabler/icons-react';
import Detail from "./detail";
import UpdateArticle from "./update";
const ArticlesList = () => {
    const API_BASE_URL = "http://localhost:5000/articles"
    const [activePage, setPage] = useState(1);
    const [opened, { open, close }] = useDisclosure(false);
    const [opened1, { open: open1, close: close1 }] = useDisclosure(false);
    const [opened2, { open: open2, close: close2 }] = useDisclosure(false);


    const [Designation_article_filter, setDesignation_article_filter] = useState("");
    const [Designation_famille_article_filter, setDesignation_famille_article_filter] = useState("");
    const [veille, setveille] = useState(true);
    const [cours, setcours] = useState(true);
    const [disponible, setdisponible] = useState(true);

    const [horsstock, sethorsstock] = useState(true);

    const [sortBy, setsortBy] = useState("id");




    const [selectedArticleIndex, setSelectedArticleIndex] = useState(null);





    const fetchItems = async () => {
        return await axios.get(`${API_BASE_URL}?page=${activePage}`);
    };
    const queryArticles = useQuery(`page${activePage}`, fetchItems);
    const { data: Articles, isLoading: isArticlesLoading, error: ArticlesError } = queryArticles
    const refetch = () => {
        queryArticles.refetch();

    };


    const deleteArticle = () => {
        axios.delete(`${API_BASE_URL}/${activePage}`).then(result => {
            window.location.reload()
        }).catch(error => {
            alert(error.message)
        })

    }
    if (isArticlesLoading) return (<Loader color="blue" />)


    if (ArticlesError) return (<Alert variant="light" color="red" title="Problem" icon={IconInfoCircle}>
        {ArticlesError.message}
    </Alert>)

    const rows=()=>{
        return(
            Articles.data.articles
                        .filter((el) => { return el.Designation_article.includes(Designation_article_filter) })
                        .filter((el) => { return el.Designation_famille_article.includes(Designation_famille_article_filter) })
                        .filter((el) => {
                            if (veille && el.Statut_article == "en_veille") { return true }
                            else if (cours) { return el.Statut_article == "en_cours" }
                        })
                        .filter((el) => {
                            if (disponible && el.Stock_disponible_quantite > 0) { return true }
                            else if (horsstock && el.Stock_disponible_quantite == 0) { return true }
                        })
                        .sort((a, b) => Number( a[sortBy]) -Number( b[sortBy]))
                        .map((element, i) => (
                            <Table.Tr key={i}>
                                <Table.Td>{element.Code_article}</Table.Td>
                                <Table.Td>{element.Designation_article}</Table.Td>
                                <Table.Td>{element.Designation_famille_article}</Table.Td>
                                <Table.Td>{element.Prix_achat}</Table.Td>
                                <Table.Td>{element.Prix_vente}</Table.Td>
                                <Table.Td>{element.Taux_marge}</Table.Td>
                                <Table.Td>{element.Stock_disponible_quantite}</Table.Td>
                                <Table.Td>{element.Stock_disponible_valeur}</Table.Td>
                                <Table.Td>{element.Statut_article}</Table.Td>
                                <Table.Td>
                                    <div className="actionGroup">
                                        <ActionIcon onClick={() => { setSelectedArticleIndex(element.id); open() }} size="xl" variant="danger" aria-label="Danger variant">
                                            <IconBook />
                                        </ActionIcon>
                                        <ActionIcon onClick={() => { setSelectedArticleIndex(element.id); open1() }} size="xl" variant="danger" aria-label="Danger variant">
                                            <IconEdit />
                                        </ActionIcon>
                                        <ActionIcon onClick={() => { setSelectedArticleIndex(element.id); open2() }} size="xl" variant="danger" aria-label="Danger variant">
                                            <IconTrashFilled />
                                        </ActionIcon>
                                    </div>
                                </Table.Td>
                            </Table.Tr>
                        ))
        )
    }

    


    return (
        <div className="content">

            <Group justify="space-around" >
                <TextInput
                    withAsterisk
                    placeholder="désignation d'article ..."
                    onChange={(e) => { setDesignation_article_filter(e.target.value) }}
                />
                <TextInput
                    withAsterisk
                    placeholder="désignation d'article ..."
                    onChange={(e) => { setDesignation_famille_article_filter(e.target.value) }}
                />
                <Checkbox
                    checked={veille}
                    label="veille"
                    onClick={() => { setveille(!veille) }}
                />
                <Checkbox
                    checked={cours}
                    label="cours"
                    onClick={() => { setcours(!cours) }}
                />
                <Checkbox
                    checked={disponible}
                    label="disponible"
                    onClick={() => { setdisponible(!disponible) }}
                />
                <Checkbox
                    checked={horsstock}
                    label="horsstock"
                    onClick={() => { sethorsstock(!horsstock) }}
                />
                

            </Group>
            <Table striped highlightOnHover withTableBorder withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Code_article</Table.Th>
                        <Table.Th>Designation_article</Table.Th>
                        <Table.Th>Designation_famille_article</Table.Th>
                        <Table.Th>Prix_achat <IconArrowsMoveVertical onClick={()=>{setsortBy("Prix_achat")}} />  </Table.Th>
                        <Table.Th>Prix_vente <IconArrowsMoveVertical onClick={()=>{setsortBy("Prix_vente")}} /> </Table.Th>
                        <Table.Th>Taux_marge <IconArrowsMoveVertical onClick={()=>{setsortBy("Taux_marge")}} />  </Table.Th>
                        <Table.Th>Stock_disponible_quantite  <IconArrowsMoveVertical onClick={()=>{setsortBy("Stock_disponible_quantite")}} /> </Table.Th>
                        <Table.Th>Stock_disponible_valeur <IconArrowsMoveVertical onClick={()=>{setsortBy("Stock_disponible_valeur")}} /> </Table.Th>
                        <Table.Th>Statut_article</Table.Th>
                        <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {rows()}
                </Table.Tbody>
            </Table>
            <Pagination value={activePage} onChange={(e) => { setPage(e); refetch() }} total={Articles.data.totalPages} />;


            <Modal opened={opened} onClose={close} title="Detail">
                <Detail id={selectedArticleIndex} />
            </Modal>
            <Modal opened={opened1} onClose={close1} title="update">
                <UpdateArticle id={selectedArticleIndex} />
            </Modal>

            <Modal opened={opened2} onClose={close2} title="update">
                <h3 style={{ textAlign: "center" }}>Are you Sure?</h3>
                <Group justify="space-around" >
                    <Button onClick={deleteArticle} variant="outline" color="red">yes</Button>
                    <Button onClick={close2} >no</Button>

                </Group>
            </Modal>
        </div>
    );


}


export default ArticlesList