import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Alert, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';

const FLICKR_API = 'https://api.flickr.com/services/rest/?method=flickr.photos.getRecent&per_page=20&api_key=APIKEY&format=json&nojsoncallback=1&extras=url_s';
const CACHE_KEY = 'FLICKR_RECENT_IMAGES';

export default function HomeScreen() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(false);

    // Fetch images from API
    const fetchImages = async (pageNum = 1, showLoader = true) => {
        if (showLoader) setLoading(true);
        setError(false);
        try {
            const response = await fetch(`${FLICKR_API}&page=${pageNum}`);
            const data = await response.json();
            if (data.photos && data.photos.photo) {
                const urls = data.photos.photo.map(photo => photo.url_s).filter(Boolean);
                if (pageNum === 1) {
                    // Get cached URLs
                    const cached = await AsyncStorage.getItem(CACHE_KEY);
                    if (!cached || cached !== JSON.stringify(urls)) {
                        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(urls));
                    }
                    setImages(urls);
                } else {
                    setImages(prev => [...prev, ...urls]);
                }
                setHasMore(data.photos.page < data.photos.pages);
            } else {
                throw new Error('No photos found');
            }
        } catch (error) {
            setError(true);
            // On error, try to load from cache if it's the first page
            if (pageNum === 1) {
                const cached = await AsyncStorage.getItem(CACHE_KEY);
                if (cached) {
                    setImages(JSON.parse(cached));
                }
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchImages(1);
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        setPage(1);
        fetchImages(1, false);
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchImages(nextPage, false);
        }
    };

    const renderItem = ({ item }) => (
        <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />
    );

    return (
        <View style={styles.container}>
            {loading && page === 1 ? (
                <ActivityIndicator size="large" style={styles.loader} />
            ) : images.length > 0 ? (
                <FlatList
                    data={images}
                    keyExtractor={(item, idx) => item + idx}
                    numColumns={2}
                    renderItem={renderItem}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
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
                <Text style={styles.noResults}>No images to display.</Text>
            )}

            <Snackbar
                visible={error}
                onDismiss={() => setError(false)}
                action={{
                    label: 'Retry',
                    onPress: () => fetchImages(page)
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
