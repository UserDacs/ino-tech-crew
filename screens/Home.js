import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, FlatList } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native-virtualized-view';
import { images, COLORS, SIZES, icons } from "../constants";
import { banners, categories, mostPopularServices , allServices} from '../data';
import SubHeaderItem from '../components/SubHeaderItem';
import Category from '../components/Category';
import ServiceCard from '../components/ServiceCard';
import { useTheme } from '../theme/ThemeProvider';

const Home = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { dark, colors } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState(["1"]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [services, setServices] = useState([]);


    const API_URL = "http://192.168.1.104/api/services/list-with-comments";
  

    useEffect(() => {
      checkAuthenticationStatus();
      fetchFilteredServices();
      }, []);
  
  
    const fetchFilteredServices = async () => {
      try {
        setLoading(true);
        const authToken = await AsyncStorage.getItem("userToken");
  
        if (!authToken) {
          console.error("No auth token found");
          setLoading(false);
          return;
        }
  
        console.log("Auth Token:", authToken); // Debugging log
  
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // Use `authToken` directly
          },
          body: JSON.stringify({ categories: selectedCategories }), // Send data if required
        });
  
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: Failed to fetch services`);
        }
  
        const data = await response.json();
        console.log(data);
        
        setServices(data || []); // Ensure data structure is valid
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    };
  
    // Toggle category selection
    const toggleCategory = (categoryId) => {
      setSelectedCategories((prevCategories) =>
        prevCategories.includes(categoryId)
          ? prevCategories.filter((id) => id !== categoryId) // Remove category
          : [...prevCategories, categoryId] // Add category
      );
    };
  
    // Category item
    const renderCategoryItem = ({ item }) => (
      <TouchableOpacity
        style={{
          backgroundColor: selectedCategories.includes(item.id) ? COLORS.primary : "transparent",
          padding: 10,
          marginVertical: 5,
          borderColor: COLORS.primary,
          borderWidth: 1.3,
          borderRadius: 24,
          marginRight: 12,
        }}
        onPress={() => toggleCategory(item.id)}
      >
        <Text style={{ color: selectedCategories.includes(item.id) ? COLORS.white : COLORS.primary }}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  
 

  const checkAuthenticationStatus = async () => {
    try {
      const value = await AsyncStorage.getItem('isAuthenticated');

      if (value === 'true') {
        setIsAuthenticated(true);
          await AsyncStorage.setItem('isAuthenticated', 'true');
        console.log("User is authenticated.");
      } else {
        setIsAuthenticated(false);
        console.log("User is not authenticated.");
      }
    } catch (error) {
      console.error("Error checking authentication status:", error);
    }
  };

  const renderBannerItem = ({ item }) => (
    <View style={styles.bannerContainer}>
      <View style={styles.bannerTopContainer}>
        <View>
          <Text style={styles.bannerDicount}>{item.discount} OFF</Text>
          <Text style={styles.bannerDiscountName}>{item.discountName}</Text>
        </View>
        <Text style={styles.bannerDiscountNum}>{item.discount}</Text>
      </View>
      <View style={styles.bannerBottomContainer}>
        <Text style={styles.bannerBottomTitle}>{item.bottomTitle}</Text>
        <Text style={styles.bannerBottomSubtitle}>{item.bottomSubtitle}</Text>
      </View>
    </View>
  );

  const keyExtractor = (item) => item.id.toString();

  const handleEndReached = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const renderDot = (index) => {
    return (
      <View
        style={[styles.dot, index === currentIndex ? styles.activeDot : null]}
        key={index}
      />
    );
  };
  /**
  * Render Header
  */
  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Profile")}>
            <Image
              source={images.user5}
              resizeMode='cover'
              style={styles.avatar}
            />
          </TouchableOpacity>
          <Text style={[styles.username, { 
            color: dark? COLORS.white : COLORS.greyscale900
          }]}>Hi, Joanna!</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("Notifications")}>
          <Image
            source={icons.bell}
            resizeMode='contain'
            style={[styles.bellIcon, { 
              tintColor: dark? COLORS.white : COLORS.greyscale900
            }]}
          />
          <View
            style={styles.noti}
          />
        </TouchableOpacity>
      </View>
    )
  }

  /**
  * render search bar
  */
  const renderSearchBar = () => {
    const [search, setSearch] = useState("");
    const handleInputFocus = () => {
      // Redirect to another screen
      navigation.navigate('Search');
    };

    return (
      <View style={[styles.searchContainer, {  
        borderColor: dark ? COLORS.grayscale700 : "#E5E7EB"
        }]}>
        <TouchableOpacity>
          <Image
            source={icons.search2}
            resizeMode='contain'
            style={styles.searchIcon}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={(value) => setSearch(value)}
          placeholder='Search services...'
          placeholderTextColor="#BABABA"
          onFocus={handleInputFocus}
        />
        <TouchableOpacity>
          <Image
            source={icons.filter}
            resizeMode='contain'
            style={[styles.filterIcon, { 
              tintColor: dark? COLORS.white : COLORS.greyscale900
            }]}
          />
        </TouchableOpacity>
      </View>
    )
  }

  /**
   * Render banner
   */
  const renderBanner = () => {
    return (
      <View style={styles.bannerItemContainer}>
        <FlatList
          data={banners}
          renderItem={renderBannerItem}
          keyExtractor={keyExtractor}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(
              event.nativeEvent.contentOffset.x / SIZES.width
            );
            setCurrentIndex(newIndex);
          }}
        />
        <View style={styles.dotContainer}>
          {banners.map((_, index) => renderDot(index))}
        </View>
      </View>
    )
  }

  /**
   * Render categories
   */
  const renderCategories = () => {

    return (
      <View>
        <SubHeaderItem
          title="Categories"
          navTitle="See all"
          onPress={() => console.log("See all services")}
        />
        <FlatList
          data={categories}
          keyExtractor={(item, index) => index.toString()}
          horizontal={false}
          numColumns={4} // Render two items per row
          renderItem={({ item, index }) => (
            <Category
              name={item.name}
              icon={item.icon}
              iconColor={item.iconColor}
              backgroundColor={item.backgroundColor}
            />
          )}
        />
      </View>
    )
  }

  /**
   * Render Top Services
   */

  const handleScroll = (event) => {
    if (event.nativeEvent.contentOffset.y <= 0) {
      fetchFilteredServices(); // Reload data when user scrolls to top
    }
  };
  
  const renderTopServices = () => {
   

    return (
      <View>
        <SubHeaderItem
          title="Recommended Services"
          navTitle="See all"
          onPress={() => navigation.navigate("PopularServices")}
        />
       
        <FlatList
          data={services}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <ServiceCard
                name={item.name}
                image={{ uri: "http://192.168.1.104"+item.photo_path }} 
                providerName={item.user ? item.user.name : "Unknown Provider"}
                price={item.service_fee}
                // isOnDiscount={item.isOnDiscount}
                // oldPrice={item.oldPrice}
                rating={item.ratings.length}
                numReviews={item.ratings.length}
                onPress={() => navigation.navigate("ServiceDetails")}
                // categoryId={item.categoryId}
              />
            )
          }}
          onScroll={handleScroll} // Detect scrolling
          scrollEventThrottle={16} // Optimize performance
        />
      </View>
    )
  }

  return (
    <SafeAreaView style={[styles.area, { backgroundColor: colors.background }]}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderHeader()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderSearchBar()}
          {renderTopServices()} 
        </ScrollView>
      </View>
    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  area: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    padding: 16
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: SIZES.width - 32,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 999,
    marginRight: 12
  },
  username: {
    fontSize: 16,
    fontFamily: "semiBold",
    color: COLORS.black
  },
  bellIcon: {
    width: 24,
    height: 24,
    tintColor: COLORS.black
  },
  noti: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: COLORS.red,
    position: "absolute",
    top: 0,
    right: 3,
    zIndex: 99999
  },
  headerLeft: {
    alignItems: "center",
    flexDirection: "row",
  },
  searchContainer: {
    height: 50,
    width: SIZES.width - 32,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginTop: 22,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12
  },
  searchIcon: {
    height: 20,
    width: 20,
    tintColor: "#BABABA"
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginHorizontal: 8,
    borderRightColor: "#BABABA",
    borderRightWidth: .4
  },
  filterIcon: {
    width: 20,
    height: 20,
    tintColor: COLORS.black
  },
  bannerContainer: {
    width: SIZES.width - 32,
    height: 154,
    paddingHorizontal: 28,
    paddingTop: 28,
    borderRadius: 32,
    backgroundColor: COLORS.primary
  },
  bannerTopContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  bannerDicount: {
    fontSize: 12,
    fontFamily: "medium",
    color: COLORS.white,
    marginBottom: 4
  },
  bannerDiscountName: {
    fontSize: 16,
    fontFamily: "bold",
    color: COLORS.white
  },
  bannerDiscountNum: {
    fontSize: 46,
    fontFamily: "bold",
    color: COLORS.white
  },
  bannerBottomContainer: {
    marginTop: 8
  },
  bannerBottomTitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white
  },
  bannerBottomSubtitle: {
    fontSize: 14,
    fontFamily: "medium",
    color: COLORS.white,
    marginTop: 4
  },
  bannerItemContainer: {
    width: "100%",
    paddingBottom: 10,
    backgroundColor: COLORS.primary,
    height: 170,
    borderRadius: 32,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#ccc',
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: COLORS.white,
  },
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap"
  }
})

export default Home