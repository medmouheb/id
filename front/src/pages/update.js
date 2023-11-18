import React, { useState } from "react";
import { useQuery } from 'react-query'
import axios from "axios"
import { Loader, Alert, Table, Pagination, ActionIcon, Modal, Box, TextInput, Group, Button } from '@mantine/core';
import { IconInfoCircle } from "@tabler/icons-react";



const UpdateArticle = (props) => {
    const API_BASE_URL = "http://localhost:5000/articles"

    const [Code_article, setCode_article] = useState(null)
    const [Designation_article, setDesignation_article] = useState(null)
    const [Designation_famille_article, setDesignation_famille_article] = useState(null)
    const [Prix_achat, setPrix_achat] = useState(null)
    const [Prix_vente, setPrix_vente] = useState(null)
    const [Taux_marge, setTaux_marge] = useState(null)
    const [Stock_disponible_quantite, setStock_disponible_quantite] = useState(null)
    const [Stock_disponible_valeur, setStock_disponible_valeur] = useState(null)
    const [Statut_article, setStatut_article] = useState(null)

    const fetchItems = async () => {
        return await axios.get(`${API_BASE_URL}/${props.id}`).then(response => {
            setCode_article(response.data.Code_article)
            setDesignation_article(response.data.Designation_article)
            setDesignation_famille_article(response.data.Designation_famille_article)
            setPrix_achat(response.data.Prix_achat)
            setPrix_vente(response.data.Prix_vente)
            setTaux_marge(response.data.Taux_marge)
            setStock_disponible_quantite(response.data.Stock_disponible_quantite)
            setStock_disponible_valeur(response.data.Stock_disponible_valeur)
            setStatut_article(response.data.Statut_article)
        });
    };
    const queryArticle = useQuery(`article${props.id}`, fetchItems);
    const { isLoading: isArticleLoading, error: ArticleError } = queryArticle

    const submit = (e) => {
        e.preventDefault()
        axios.put(`${API_BASE_URL}/${props.id}`, { Code_article, Designation_article, Designation_famille_article, Prix_achat, Prix_vente, Taux_marge, Stock_disponible_quantite, Stock_disponible_valeur, Statut_article }).then(reulst => {
            window.location.reload()
        }).catch(error => {
            alert(error.message)

        })
    }

    if (isArticleLoading) return (<Loader color="blue" />)


    if (ArticleError) return (<Alert variant="light" color="red" title="Problem" icon={IconInfoCircle}>
        {ArticleError.message}
    </Alert>)

    return <Box maw={340} mx="auto">
        <form onSubmit={(e) => { submit(e) }}>
            <TextInput
                withAsterisk
                label="Code_article"
                placeholder="Code_article ..."
                value={Code_article}
                onChange={(e) => { setCode_article(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Designation_article"
                placeholder="Designation_article ..."
                value={Designation_article}
                onChange={(e) => { setDesignation_article(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Designation_famille_article"
                placeholder="Designation_famille_article ..."
                value={Designation_famille_article}
                onChange={(e) => { setDesignation_famille_article(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Prix_achat"
                placeholder="Prix_achat ..."
                value={Prix_achat}
                onChange={(e) => { setPrix_achat(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Prix_vente"
                placeholder="Prix_vente ..."
                value={Prix_vente}
                onChange={(e) => { setPrix_vente(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Taux_marge"
                placeholder="Taux_marge ..."
                value={Taux_marge}
                onChange={(e) => { setTaux_marge(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Stock_disponible_quantite"
                placeholder="Stock_disponible_quantite ..."
                value={Stock_disponible_quantite}
                onChange={(e) => { setStock_disponible_quantite(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Stock_disponible_valeur"
                placeholder="Stock_disponible_valeur ..."
                value={Stock_disponible_valeur}
                onChange={(e) => { setStock_disponible_valeur(e.target.value) }}
            />
            <TextInput
                withAsterisk
                label="Statut_article"
                placeholder="Statut_article ..."
                value={Statut_article}
                onChange={(e) => { setStatut_article(e.target.value) }}
            />


            <Group justify="center" mt="md">
                <Button type="submit">Submit</Button>
            </Group>
        </form>
    </Box>
}

export default UpdateArticle
