import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CategoryScreen = ({ route }) => {
  const { categoryId, categoryName } = route.params;
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Movies for Category: {categoryName}</Text>
      {/* Placeholder content for the list of movies in this category */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  text: {
    fontSize: 18,
  },
});

export default CategoryScreen;