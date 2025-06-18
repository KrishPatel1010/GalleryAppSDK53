import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native';
import { Snackbar } from 'react-native-paper';

const SEARCH_API = 'https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=6f102c62f41998d151e5a1b48713cf13&format=json&nojsoncallback=1&extras=url_s&per_page=20';

export default function SearchScreen() {
    const [searchText, setSearchText] = useState('');
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);

    const searchImages = async (searchQuery, pageNum = 1) => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setError(false);
        try {
            const response = await fetch(`${SEARCH_API}&text=${encodeURIComponent(searchQuery)}&page=${pageNum}`);
            const data = await response.json();

            if (data.photos && data.photos.photo) {
                const newImages = data.photos.photo.map(photo => photo.url_s).filter(Boolean);
                if (pageNum === 1) {
                    setImages(newImages);
                } else {
                    setImages(prev => [...prev, ...newImages]);
                }
                setHasMore(data.photos.page < data.photos.pages);
            }
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        setPage(1);
        searchImages(searchText, 1);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            searchImages(searchText, nextPage);
        }
    };

    const renderItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    );

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search photos..."
                    onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                    <Text style={styles.searchButtonText}>Search</Text>
                </TouchableOpacity>
            </View>

            {loading && page === 1 ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : images.length > 0 ? (
                <FlatList
                    data={images}
                    keyExtractor={(item, idx) => item + idx}
                    numColumns={2}
                    renderItem={renderItem}
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={() =>
                        loading && page > 1 ? (
                            <View style={{ padding: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <ActivityIndicator size="small" />
                            </View>
                        ) : null
                    }
                />
            ) : (
                <Text style={styles.noResults}>No images found</Text>
            )}

            <Snackbar
                visible={error}
                onDismiss={() => setError(false)}
                action={{
                    label: 'Retry',
                    onPress: () => searchImages(searchText, page)
                }}
            >
                Network error. Please try again.
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
    },
    searchContainer: {
        flexDirection: 'row',
        padding: 10,
        gap: 10,
    },
    searchInput: {
        flex: 1,
        height: 40,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    searchButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
    },
    searchButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    image: {
        width: '48%',
        aspectRatio: 1,
        margin: '1%',
        borderRadius: 8,
        backgroundColor: '#eee',
    },
    loader: {
        marginTop: 40,
    },
    footerLoader: {
        padding: 20,
    },
    noResults: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 16,
        color: '#666',
    },
}); 