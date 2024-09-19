import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import colors from '../styles/theme';

const MovieItem = ({ item }) => {
  const posterUrl = item.poster_path
    ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
    : 'https://via.placeholder.com/200x300?text=No+Image';
  const releaseYear = item.release_date ? item.release_date.substring(0, 4) : 'N/A';

  return (
    <View style={styles.movieItem}>
      <Image source={{ uri: posterUrl }} style={styles.moviePoster} />
      <Text style={styles.movieTitle}>{item.title}</Text>
      <Text style={styles.movieYear}>Year: {releaseYear}</Text>
      <Text style={styles.movieRating}>Rating: {item.vote_average.toFixed(1)}</Text>
    </View>
  );
};

const areEqual = (prevProps, nextProps) => {
    return prevProps.item.id === nextProps.item.id;
  };
  
export default React.memo(MovieItem, areEqual);

const styles = StyleSheet.create({
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
});
