import React, { useEffect, useState } from 'react';
import './Application.css';
import Pagination from '@material-ui/lab/Pagination';
import { TextField, CircularProgress } from '@mui/material';

function PokemonList() {
    const [loading, setLoading] = useState(true);
    const [pokemonList, setPokemonList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 12; // Nombre de Pokémon à afficher par page

    useEffect(() => {
        const fetchPokemonList = async () => {
            try {
                const response = await fetch(
                    'https://pokeapi.co/api/v2/pokemon?offset=0&limit=600'
                );
                const data = await response.json();
                setPokemonList(data.results);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        };

        fetchPokemonList();
    }, []);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Réinitialiser la page lors d'une nouvelle recherche
    };

    const filteredPokemon = pokemonList.filter((poke) =>
        poke.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageItems = filteredPokemon.slice(startIndex, endIndex);

    const fetchPokemonDetails = async (url) => {
        try {
            const response = await fetch(url);
            const data = await response.json();
            return data.sprites.other.dream_world.front_default;
        } catch (error) {
            console.log(error);
            return null;
        }
    };

    const [pokemonImages, setPokemonImages] = useState({});
    useEffect(() => {
        const fetchImages = async () => {
            const images = {};
            for (const pokemon of currentPageItems) {
                const imageUrl = await fetchPokemonDetails(pokemon.url);
                images[pokemon.name] = imageUrl;
            }
            setPokemonImages(images);
        };

        fetchImages();
    }, [currentPageItems]);

    return (
        <>
            {loading ? (
                <div className="loader-container">
                    <CircularProgress />
                </div>
            ) : (
                <><br />
                    <center>
                        <TextField
                            label="Rechercher un Pokémon"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </center>
                    <br />
                    <div className="container">
                        {currentPageItems.map((poke, index) => (
                            <div className="shadow-sm p-3 mb-5 bg-body rounded" key={index}>
                                <h4>{poke.name}</h4>
                                {pokemonImages[poke.name] ? (
                                    <img
                                        src={pokemonImages[poke.name]}
                                        alt={poke.name}
                                        style={{ width: '80px' }}
                                    />
                                ) : (
                                    <p>Loading image...</p>
                                )}
                            </div>
                        ))}
                        <center>
                            <Pagination
                                count={Math.ceil(filteredPokemon.length / itemsPerPage)}
                                page={currentPage}
                                onChange={handlePageChange}
                                color="primary"
                            />
                        </center>
                    </div>
                </>
            )}
        </>
    );
}

export default PokemonList;
