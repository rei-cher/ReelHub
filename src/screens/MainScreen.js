import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import axios from 'axios';
import moviesData from '../data/moviesData.json';
import { images } from '../data/images';

const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual API key

const MainScreen = ({ navigation }) => {
  const [newestMovies, setNewestMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState({});

  useEffect(() => {
    // fetchNewestMovies();
    // fetchCategories();
    setNewestMovies(moviesData.newestMovies);
    setCategories(moviesData.categories);
    setCategoryMovies(moviesData.categoryMovies);
  }, []);

  const fetchNewestMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}`
      );
      setNewestMovies(response.data.results.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
      );
      setCategories(response.data.genres);
      response.data.genres.forEach((genre) => {
        fetchMoviesByCategory(genre.id);
      });
    } catch (error) {
      console.error(error);
    }
  };

  const fetchMoviesByCategory = async (genreId) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}`
      );
      setCategoryMovies((prevState) => ({
        ...prevState,
        [genreId]: response.data.results.slice(0, 5),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const renderNewestMovie = ({ item }) => (
    <Image
    //   source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
      source={images[item.poster_path]}
      style={styles.newestMovieImage}
    />
  );

  const renderCategorySection = (genre) => {
    const movies = categoryMovies[genre.id] || [];
    return (
      <View key={genre.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryName}>{genre.name}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Category', { categoryId: genre.id, categoryName: genre.name })
            }
          >
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={movies}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image
            //   source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              source={{ uri: item.poster_path }}
              style={styles.categoryMovieImage}
            />
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Newest Movies Section */}
      <FlatList
        data={newestMovies}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewestMovie}
        style={styles.newestMoviesList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Category Filter */}
      <ScrollView horizontal style={styles.categoriesScroll} showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.categoryButton}
            onPress={() =>
              navigation.navigate('Category', { categoryId: item.id, categoryName: item.name })
            }
          >
            <Text style={styles.categoryText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Sections */}
      {categories.map((genre) => renderCategorySection(genre))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newestMoviesList: {
    height: Dimensions.get('window').height * 0.4,
  },
  newestMovieImage: {
    width: Dimensions.get('window').width * 0.8,
    height: '100%',
    marginHorizontal: 10,
    borderRadius: 10,
  },
  categoriesScroll: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  categoryButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    marginHorizontal: 5,
    borderRadius: 20,
  },
  categoryText: {
    fontSize: 16,
  },
  categorySection: {
    marginVertical: 10,
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 15,
    marginBottom: 5,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAllText: {
    color: 'blue',
  },
  categoryMovieImage: {
    width: 120,
    height: 180,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default MainScreen;