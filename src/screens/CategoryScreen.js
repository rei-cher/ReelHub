import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Animated
} from 'react-native';
import axios from 'axios';
import { TMDB_API } from '@env';
import colors from '../styles/theme';
import GlobalStyles from '../styles/GlobalStyles';
import { Picker } from '@react-native-picker/picker';
import MovieItem from '../components/MovieItem';

const CategoryScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;

  // State to manage the list of unique movie IDs
  const movieIDList = useRef(new Set()); // Movie IDs will be stored here
  const [movies, setMovies] = useState([]); // List of movies to display
  const [sortedMovies, setSortedMovies] = useState([]); // Sorted movies list
  const [loading, setLoading] = useState(true); // Loading indicator
  const [sortOption, setSortOption] = useState('none'); // Sorting options
  const [currentPage, setCurrentPage] = useState(1); // Track current page
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [loadingMore, setLoadingMore] = useState(false); // Indicator for loading more movies
  const fadeAnim = useRef(new Animated.Value(0)).current; // Fade animation

  useEffect(() => {
    movieIDList.current = new Set(); // Reset the movie ID list on category change
    setMovies([]); // Clear the current movie list
    fetchMoviesByCategory(categoryId, 1); // Fetch first page of movies
    setCurrentPage(1); // Reset the current page to 1
  }, [categoryId]);

  useEffect(() => {
    if(sortOption !== 'none'){
      sortMovies(sortOption); // Sort movies when sorting option changes
    }
  }, [sortOption]);

  useEffect(() => {
    // Animate the fade-in effect when the movies state is updated
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500, // Smooth animation over 500ms
      useNativeDriver: true, // For better performance
    }).start();
  }, [movies]);

  // Fetch movies and filter out duplicates
  const fetchMoviesByCategory = async (genreId, page = 1) => {
    if (loadingMore) return;

    setLoadingMore(true);

    try {
      console.log(`Fetching page ${page}`);
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API}&with_genres=${genreId}&language=en-US&page=${page}`
      );

      const newMovies = response.data.results.map(movie => ({...movie, page})); // Get movies from response
      setTotalPages(response.data.total_pages); // Update total pages

      // Filter movies to only add unique IDs
      const filteredNewMovies = newMovies.filter((movie) => {
        if (movieIDList.current.has(movie.id)) {
          // If movie ID is already in the set, it's a duplicate
          return false;
        } else {
          // Add unique movie ID to the set
          movieIDList.current.add(movie.id);
          return true;
        }
      });

      console.log(`Fetching page ${page}`);
      // console.log('Unique movies being added:', filteredNewMovies.map((movie) => movie.id));

      // Update the movies state with unique movies
      setMovies((prevMovies) => [...prevMovies, ...filteredNewMovies]);

      setLoading(false);
      setLoadingMore(false);
    } catch (error) {
      console.error('Error fetching movies by category:', error);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const sortMovies = (option) => {
    let sorted = [...movies];
    switch (option) {
      case 'name_asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name_desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'year_asc':
        sorted.sort((a, b) => {
          const aYear = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
          const bYear = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
          return aYear - bYear;
        });
        break;
      case 'year_desc':
        sorted.sort((a, b) => {
          const aYear = a.release_date ? parseInt(a.release_date.substring(0, 4)) : 0;
          const bYear = b.release_date ? parseInt(b.release_date.substring(0, 4)) : 0;
          return bYear - aYear;
        });
        break;
      case 'rating_asc':
        sorted.sort((a, b) => a.vote_average - b.vote_average);
        break;
      case 'rating_desc':
        sorted.sort((a, b) => b.vote_average - a.vote_average);
        break;
      default:
        return;
    }
    setSortedMovies(sorted);
  };

  const handleMovieClick = (movie) => {
    const releaseYear = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
    console.log(`Movie Name: ${movie.title}, ID: ${movie.id}, Year: ${releaseYear}, Page: ${movie.page}`);
  };

  // Render movie item
  const renderMovieItem = ({ item }) => {
    return (
      <TouchableOpacity style={{flex: 1}} onPress={() => handleMovieClick(item)}>
        <MovieItem item={item} />
      </TouchableOpacity>
    );
  };

  // Load more movies when scrolled to the bottom
  const loadMoreMovies = () => {
    if (loadingMore || currentPage >= totalPages) return;

    const nextPage = currentPage + 1;
    fetchMoviesByCategory(categoryId, nextPage); // Fetch next page of movies
    setCurrentPage(nextPage);
  };

  const renderFooter = () => {
    if (!loadingMore) return null;

    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  };

  if (loading) {
    return (
      <View style={GlobalStyles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with Category Name and Sort Picker */}
      <View style={styles.header}>
        <Text style={styles.categoryName}>{categoryName}</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.picker}
          onValueChange={(itemValue) => {
            setSortOption(itemValue);
            if (itemValue === 'none') {
              setSortedMovies([]); // Clear sorted movies if "None" is selected
            }
          }}
          mode="dropdown"
        >
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Name (A-Z)" value="name_asc" />
          <Picker.Item label="Name (Z-A)" value="name_desc" />
          <Picker.Item label="Year (Ascending)" value="year_asc" />
          <Picker.Item label="Year (Descending)" value="year_desc" />
          <Picker.Item label="Rating (Ascending)" value="rating_asc" />
          <Picker.Item label="Rating (Descending)" value="rating_desc" />
        </Picker>
      </View>

      {/* Movie Grid */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <FlatList
          data={sortOption === 'none' ? movies : sortedMovies} // Use the sorted movie list
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMovieItem}
          numColumns={2}
          contentContainerStyle={styles.movieList}
          onEndReached={loadMoreMovies}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          removeClippedSubviews={true}
          initialNumToRender={10}
          maxToRenderPerBatch={5}
          windowSize={5}
          updateCellsBatchingPeriod={50}
          scrollEventThrottle={16}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primaryText,
  },
  picker: {
    height: 50,
    width: 180,
    color: colors.primaryText,
  },
  movieList: {
    paddingHorizontal: 5,
  },
  movieItem: {
    flex: 1,
    margin: 5,
    backgroundColor: colors.cardBackground,
    borderRadius: 10,
    padding: 5,
    alignItems: 'center',
  },
  moviePoster: {
    width: '100%',
    aspectRatio: 2 / 3,
    borderRadius: 10,
  },
  movieTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primaryText,
    marginTop: 5,
    textAlign: 'center',
  },
  movieYear: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
  },
  movieRating: {
    fontSize: 14,
    color: colors.secondaryText,
    marginTop: 2,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center'
  }
});

export default CategoryScreen;