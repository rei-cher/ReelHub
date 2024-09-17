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
import { TMDB_API } from '@env';
import colors from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';

const screenWidth = Dimensions.get('window').width;

const MainScreen = ({ navigation }) => {
  const [newestMovies, setNewestMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryMovies, setCategoryMovies] = useState({});

  useEffect(() => {
    fetchNewestMovies();
    fetchCategories();
  }, []);

  const fetchNewestMovies = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${TMDB_API}&language=en-US&page=1`
      );
      setNewestMovies(response.data.results.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API}&language=en-US&page=1`
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
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API}&with_genres=${genreId}&language=en-US&page=1`
      );
      setCategoryMovies((prevState) => ({
        ...prevState,
        [genreId]: response.data.results.slice(0, 5),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const renderNewestMovie = ({ item }) => {
    const posterUrl = item.poster_path
      ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
      : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
      <View style={styles.newestMovieContainer}>
        <Image
          source={{ uri: posterUrl }}
          style={styles.newestMovieImage}
          resizeMode="cover"
        />
      </View>
    );
  };

  const renderCategorySection = (genre) => {
    const movies = categoryMovies[genre.id] || [];
    return (
      <View key={genre.id} style={styles.categorySection}>
        <View style={styles.categoryHeader}>
          <Text style={[styles.categoryName, GlobalStyles.primaryText]}>{genre.name}</Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('Category', { categoryId: genre.id, categoryName: genre.name })
            }
          >
            <Text style={[styles.seeAllText, GlobalStyles.secondaryText]}>See All</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={movies}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
              style={styles.categoryMovieImage}
            />
          )}
        />
      </View>
    );
  };

  return (
    <ScrollView style={GlobalStyles.container}>
      {/* Newest Movies Section */}
      <FlatList
        data={newestMovies}
        horizontal
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderNewestMovie}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        snapToAlignment="center"
        decelerationRate="fast"
        snapToInterval={screenWidth}
        contentContainerStyle={{ alignItems: 'center' }}
      />

      {/* Category Filter */}
      <ScrollView horizontal style={styles.categoriesScroll} showsHorizontalScrollIndicator={false}>
        {categories.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={GlobalStyles.button}
            onPress={() =>
              navigation.navigate('Category', { categoryId: item.id, categoryName: item.name })
            }
          >
            <Text style={GlobalStyles.buttonText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Category Sections */}
      {categories.map((genre) => renderCategorySection(genre))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  newestMovieContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  newestMovieImage: {
    width: screenWidth * 0.9,
    aspectRatio: 2 / 3,
    borderRadius: 10,
  },
  categoriesScroll: {
    marginVertical: 10,
    paddingHorizontal: 10,
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
    color: colors.accent,
  },
  categoryMovieImage: {
    width: 120,
    height: 180,
    marginHorizontal: 5,
    borderRadius: 10,
  },
});

export default MainScreen;