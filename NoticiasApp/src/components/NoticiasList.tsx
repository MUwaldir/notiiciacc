import React from "react";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import NoticiaCard from "./NoticiaCard";

const NoticiasList = ({
  noticias,
  loading,
  refreshing,
  onRefresh,
  onEndReached,
  expandedPostId,
  onToggleText,
  onImagePress,
  onCommentsPress,
}: any) => (
  <FlatList
    data={noticias}
    keyExtractor={(item, index) => `${item.id}-${index}`}
    contentContainerStyle={styles.list}
    onRefresh={onRefresh}
    refreshing={refreshing}
    onEndReached={onEndReached}
    onEndReachedThreshold={0.5}
    renderItem={({ item }) => (
      <NoticiaCard
        item={item}
        isExpanded={expandedPostId === item._id}
        onToggleText={onToggleText}
        onImagePress={onImagePress}
        onCommentsPress={onCommentsPress}
      />
    )}
    ListFooterComponent={() =>
      loading && noticias.length > 0 ? (
        <ActivityIndicator size="small" color="#007bff" style={{ marginVertical: 16 }} />
      ) : null
    }
  />
);

const styles = StyleSheet.create({
  list: {
    padding: 12,
    backgroundColor: "#f0f2f5",
  },
});

export default NoticiasList;
