import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Linking, StyleSheet, ScrollView, FlatList, Modal, mmoAlert, Image } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tab, setTab] = useState('home');
  const [search, setSearch] = useState('');
  const [adminPassInput, setAdminPassInput] = useState('');
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [desc, setDesc] = useState('');
  const [img, setImg] = useState('');
  const [size, setSize] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [deletePass, setDeletePass] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cName, setCName] = useState('');
  const [cMobile, setCMobile] = useState('');
  const [cAddress, setCAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [onlineMethod, setOnlineMethod] = useState('UPI');
  const [deliveryCharge, setDeliveryCharge] = useState(40);
  const [loginPhone, setLoginPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Groceries', 'Beauty', 'Sports', 'Books', 'Toys'];
  const onlineOptions = ['UPI', 'Card', 'Netbanking'];
  const homeCategories = ['Categories', 'Fashion', 'Home', 'Electronics', 'Beauty'];

  useEffect(() => {
    setTimeout(() => {
      setShowSplash(false);
    }, 2000);
  }, []);

  useEffect(() => { checkLogin(); loadProducts(); loadOrderData(); loadWishlist(); }, []);
  useEffect(() => { saveOrderData(); }, [cName, cMobile, cAddress]);
  useEffect(() => { saveWishlist(); }, [wishlist]);
  useEffect(() => { AsyncStorage.setItem('upbazaar_products', JSON.stringify(products)); }, [products]);

  const saveWishlist = async () => { await AsyncStorage.setItem('upbazaar_wishlist', JSON.stringify(wishlist)); };
  const loadWishlist = async () => { const saved = await AsyncStorage.getItem('upbazaar_wishlist'); if (saved) setWishlist(JSON.parse(saved)); };
  const toggleWishlist = (item) => { const isInWishlist = wishlist.find(p => p.id === item.id); if(isInWishlist){ setWishlist(wishlist.filter(p => p.id!== item.id)); } else { setWishlist([...wishlist, item]); } };
  const saveOrderData = async () => { await AsyncStorage.setItem('upbazaar_order_data', JSON.stringify({cName, cMobile, cAddress})); };
  const loadOrderData = async () => { const saved = await AsyncStorage.getItem('upbazaar_order_data'); if (saved) { const data = JSON.parse(saved); setCName(data.cName || ''); setCMobile(data.cMobile || ''); setCAddress(data.cAddress || ''); } };
  const checkLogin = async () => { const logged = await AsyncStorage.getItem('upbazaar_login'); if(logged === 'true') setIsLoggedIn(true); };
  const sendOtp = () => { if(loginPhone.length!== 10){ Alert.alert("Sahi 10 digit number daalo"); return; } const newOtp = Math.floor(1000 + Math.random() * 9000).toString(); setGeneratedOtp(newOtp); setShowOtpBox(true); Alert.alert("OTP Bhej Diya", `Tera OTP hai: ${newOtp}`); };
  const verifyOtp = async () => { if(otp === generatedOtp){ await AsyncStorage.setItem('upbazaar_login', 'true'); setIsLoggedIn(true); } else { Alert.alert("Galat OTP"); } };
  const handleLogout = async () => { await AsyncStorage.removeItem('upbazaar_login'); setIsLoggedIn(false); setTab('home'); setShowOtpBox(false); setLoginPhone(''); };
  const loadProducts = async () => { const saved = await AsyncStorage.getItem('upbazaar_products'); if (saved) { setProducts(JSON.parse(saved)); } else { setProducts([{ id: 1, name: "Apple Watch Series 9", price: 45999, category: "Electronics", img: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=500", desc: "Latest Apple Watch", size: "" }, { id: 2, name: "Anti Gravity Humidifier", price: 1299, category: "Home", img: "https://images.unsplash.com/photo-1545127398-14699f92334b?w=500", desc: "LED Clock + Night Light", size: "15cm x 10cm" }]); } };
  const checkAdminPass = () => { if(adminPassInput === "7740") { setTab('admin'); setShowAdminLogin(false); setAdminPassInput(''); } else { Alert.alert("Galat Password"); } };
  const addProduct = () => { if(name === '' || price === ''){ Alert.alert("Naam aur Price zaroori hai"); return; } setProducts([...products, { id: Date.now(), name, price: Number(price), category, desc, img, size }]); setName(''); setPrice(''); setDesc(''); setImg(''); setSize(''); Alert.alert("Product Add ho gaya!"); };
  const deleteProduct = (id) => { if(deletePass!== "0077"){ Alert.alert("Galat Delete Password"); return; } setProducts(products.filter(p => p.id!== id)); setDeletePass(''); Alert.alert("Product Delete ho gaya"); };
  const openOrderForm = (item) => { setSelectedProduct(item); setShowOrderForm(true); };
  const sendOrder = () => { if(!cName ||!cMobile ||!cAddress){ Alert.alert("Sab details bharo"); return; } const total = selectedProduct.price + deliveryCharge; const paymentText = paymentMethod === 'Online'? `Online - ${onlineMethod}` : 'COD'; const message = `*NAYA ORDER - UpBazaar* 🙏\n\n*Product:* ${selectedProduct.name}\n*Price:* ₹${selectedProduct.price.toLocaleString('en-IN')}\n*Delivery:* ₹${deliveryCharge}\n*Total:* ₹${total.toLocaleString('en-IN')}\n*Payment:* ${paymentText}\n\n*Customer Details:*\n*Naam:* ${cName}\n*Mobile:* ${cMobile}\n*Address:* ${cAddress}`; Linking.openURL(`https://wa.me/919235711539?text=${encodeURIComponent(message)}`); setShowOrderForm(false); };
  const filteredProducts = products.filter(p => (selectedCat === 'All' || p.category === selectedCat) && p.name.toLowerCase().includes(search.toLowerCase()));

  if(showSplash){
    return(
      <View style={styles.splashContainer}>
        <Image
          source={{uri: "https://i.postimg.cc/Y2ffXQj2/Screenshot-2026-07-29-03-04-12-88-99c04817c0de5652397fc8b56c3b3817.jpg"}}
          style={styles.splashLogo}
        />
        <Text style={styles.splashTitle}>UpBazaar</Text>
        <Text style={styles.splashSub}>UP Ka Apna Bazaar</Text>
      </View>
    )
  }

  if(!isLoggedIn){
    return (<View style={styles.container}><Text style={styles.loginTitle}>UpBazaar</Text><Text style={styles.loginSub}>Uttar Pradesh Ka Apna App</Text><TextInput style={styles.input} placeholder="Mobile Number" placeholderTextColor="gray" keyboardType="phone-pad" value={loginPhone} onChangeText={setLoginPhone} maxLength={10} />{!showOtpBox? (<TouchableOpacity style={styles.loginBtn} onPress={sendOtp}><Text style={styles.loginBtnText}>OTP Bhejein</Text></TouchableOpacity> ) : (<><TextInput style={styles.input} placeholder="4 Digit OTP Daalein" placeholderTextColor="gray" keyboardType="numeric" value={otp} onChangeText={setOtp} maxLength={4} /><TouchableOpacity style={styles.loginBtn} onPress={verifyOtp}><Text style={styles.loginBtnText}>Login Karein</Text></TouchableOpacity><TouchableOpacity onPress={() => setShowOtpBox(false)}><Text style={styles.cancel}>Number Badlein</Text></TouchableOpacity></>)}</View>);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.logo}>UpBazaar</Text><View style={styles.headerIcons}><TouchableOpacity style={styles.iconBtn} onPress={() => setTab('wishlist')}><Ionicons name="heart" size={24} color="white" /></TouchableOpacity><TouchableOpacity style={styles.iconBtn} onPress={() => setShowAdminLogin(true)}><MaterialIcons name="admin-panel-settings" size={24} color="white" /></TouchableOpacity><TouchableOpacity style={styles.iconBtn}><Ionicons name="cart" size={24} color="white" /></TouchableOpacity></View></View>
      <View style={styles.searchBox}><Ionicons name="search" size={20} color="gray" /><TextInput style={styles.searchInput} placeholder="Search for Sarees, Kurtis, Cosmetics, etc." placeholderTextColor="gray" value={search} onChangeText={setSearch} /></View>
      <View style={{flex: 1}}>
        {tab === 'home' && (<ScrollView><View style={styles.locationBar}><Ionicons name="location" size={18} color="orange" /><Text style={styles.locationText}>Add delivery location to check extra discount</Text><Ionicons name="chevron-forward" size={18} color="gray" /></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>{homeCategories.map((cat, i) => (<View key={cat} style={styles.catCircleWrap}><View style={styles.catCircle}><Text style={styles.catEmoji}>{i===0?'📱':i===1?'👗':i===2?'🏠':i===3?'💻':'💄'}</Text></View><Text style={styles.catCircleText}>{cat}</Text></View>))}</ScrollView><Text style={styles.sectionTitle}>Offer Zone ⚡</Text><FlatList data={filteredProducts} keyExtractor={item => item.id.toString()} numColumns={2} renderItem={({item}) => { const isFav = wishlist.find(p => p.id === item.id); return(<TouchableOpacity style={styles.gridCard} onPress={() => openOrderForm(item)}><TouchableOpacity style={styles.heartBtn} onPress={() => toggleWishlist(item)}><Ionicons name={isFav? "heart" : "heart-outline"} size={22} color={isFav? "red" : "white"} /></TouchableOpacity>{item.img? <Image source={{uri: item.img}} style={styles.productImg} /> : <View style={styles.productImgEmpty}/>}<Text style={styles.name} numberOfLines={1}>{item.name}</Text><Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text><View style={styles.orderBtn}><Text style={styles.orderBtnText}>Order Karein</Text></View></TouchableOpacity>)}}/></ScrollView>)}
        {tab === 'category' && (<View style={{flex:1}}><Text style={styles.adminTitle}>Categories</Text><ScrollView>{categories.filter(c=>c!=='All').map(cat=><TouchableOpacity key={cat} style={styles.catListItem} onPress={()=>{setSelectedCat(cat); setTab('home');}}><Text style={styles.catListText}>{cat}</Text></TouchableOpacity>)}</ScrollView></View>)}
        {tab === 'help' && (<View style={{flex:1, justifyContent:'center', alignItems:'center'}}><Text style={styles.adminTitle}>Help & Support</Text><Text style={{color:'gray'}}>WhatsApp: 9235711539</Text></View>)}
        {tab === 'account' && (<View style={{flex:1, padding:20}}><Text style={styles.adminTitle}>My Account</Text><TouchableOpacity style={styles.logoutBtnBig} onPress={handleLogout}><Text style={styles.logoutBtnText}>Logout</Text></TouchableOpacity></View>)}
        {tab === 'wishlist' && (<View style={{flex: 1}}><Text style={styles.adminTitle}>Meri Wishlist ❤️</Text>{wishlist.length === 0? <Text style={{color: 'gray', textAlign: 'center', marginTop: 50}}>Abhi koi product add nahi hai</Text> :<FlatList data={wishlist} keyExtractor={item => item.id.toString()} numColumns={2} renderItem={({item}) => (<TouchableOpacity style={styles.gridCard} onPress={() => openOrderForm(item)}><TouchableOpacity style={styles.heartBtn} onPress={() => toggleWishlist(item)}><Ionicons name="heart" size={22} color="red" /></TouchableOpacity>{item.img? <Image source={{uri: item.img}} style={styles.productImg} /> : <View style={styles.productImgEmpty}/>}><Text style={styles.name}>{item.name}</Text><Text style={styles.price}>₹{item.price.toLocaleString('en-IN')}</Text><View style={styles.orderBtn}><Text style={styles.orderBtnText}>Order Karein</Text></View></TouchableOpacity>)}/>}</View>)}
        {tab === 'admin' && (<ScrollView><Text style={styles.adminTitle}>Admin Panel</Text><TextInput style={styles.input} placeholder="Product Ka Naam" placeholderTextColor="gray" value={name} onChangeText={setName} /><TextInput style={styles.input} placeholder="Price" placeholderTextColor="gray" keyboardType="numeric" value={price} onChangeText={setPrice} /><TextInput style={[styles.input, {height: 80}]} placeholder="Description" placeholderTextColor="gray" multiline value={desc} onChangeText={setDesc} /><TextInput style={styles.input} placeholder="Image URL" placeholderTextColor="gray" value={img} onChangeText={setImg} /><View style={styles.catRowSmall}>{categories.filter(c => c!== 'All').map(cat => (<TouchableOpacity key={cat} style={[styles.catBtnSmall, category === cat && styles.catBtnActive]} onPress={() => setCategory(cat)}><Text style={styles.catTextSmall}>{cat}</Text></TouchableOpacity>))}</View><TouchableOpacity style={styles.addBtn} onPress={addProduct}><Text style={styles.addBtnText}>Product Add Karein</Text></TouchableOpacity><TextInput style={styles.input} placeholder="Delete Password" placeholderTextColor="gray" secureTextEntry value={deletePass} onChangeText={setDeletePass} />{products.map(p => (<View key={p.id} style={styles.adminCard}><View style={{flex: 1}}><Text style={styles.name}>{p.name} - ₹{p.price.toLocaleString('en-IN')}</Text><Text style={styles.small}>{p.category}</Text></View><TouchableOpacity onPress={() => deleteProduct(p.id)}><Text style={styles.delete}>Delete</Text></TouchableOpacity></View>))}<TouchableOpacity onPress={()=>setTab('home')}><Text style={styles.cancel}>← Back to Home</Text></TouchableOpacity></ScrollView>)}
      </View>
      <View style={styles.bottomNav}><TouchableOpacity onPress={()=>setTab('home')}><Ionicons name="home" size={24} color={tab==='home'?'orange':'gray'} /><Text style={[styles.navText, tab==='home'&&{color:'orange'}]}>Home</Text></TouchableOpacity><TouchableOpacity onPress={()=>setTab('category')}><Ionicons name="grid" size={24} color={tab==='category'?'orange':'gray'} /><Text style={[styles.navText, tab==='category'&&{color:'orange'}]}>Category</Text></TouchableOpacity><TouchableOpacity onPress={()=>setTab('help')}><Ionicons name="help-circle" size={24} color={tab==='help'?'orange':'gray'} /><Text style={[styles.navText, tab==='help'&&{color:'orange'}]}>Help</Text></TouchableOpacity><TouchableOpacity onPress={()=>setTab('account')}><Ionicons name="person" size={24} color={tab==='account'?'orange':'gray'} /><Text style={[styles.navText, tab==='account'&&{color:'orange'}]}>Account</Text></TouchableOpacity></View>
      <Modal visible={showAdminLogin} transparent animationType="fade"><View style={styles.modalBg}><View style={styles.modal}><Text style={styles.modalTitle}>Admin Login</Text><TextInput style={styles.input} placeholder="Admin Password" placeholderTextColor="gray" secureTextEntry value={adminPassInput} onChangeText={setAdminPassInput} /><TouchableOpacity style={styles.sendBtn} onPress={checkAdminPass}><Text style={styles.sendBtnText}>Login</Text></TouchableOpacity><TouchableOpacity onPress={() => setShowAdminLogin(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity></View></View></Modal>
      <Modal visible={showOrderForm} transparent animationType="slide"><View style={styles.modalBg}><View style={styles.modal}><Text style={styles.modalTitle}>Order Details</Text><Text style={styles.modalProduct}>{selectedProduct?.name} - ₹{selectedProduct?.price.toLocaleString('en-IN')}</Text><TextInput style={styles.input} placeholder="1. Aapka Naam" placeholderTextColor="gray" value={cName} onChangeText={setCName} /><TextInput style={styles.input} placeholder="2. Mobile Number" placeholderTextColor="gray" keyboardType="phone-pad" value={cMobile} onChangeText={setCMobile} /><TextInput style={[styles.input, {height: 80}]} placeholder="3. Pura Address" placeholderTextColor="gray" multiline value={cAddress} onChangeText={setCAddress} /><Text style={{color: 'white', fontWeight: 'bold', marginBottom: 5}}>4. Payment Method:</Text><View style={{flexDirection: 'row', marginBottom: 15}}><TouchableOpacity style={[styles.catBtnSmall, paymentMethod === 'COD' && styles.catBtnActive]} onPress={() => setPaymentMethod('COD')}><Text style={styles.catTextSmall}>COD</Text></TouchableOpacity><TouchableOpacity style={[styles.catBtnSmall, paymentMethod === 'Online' && styles.catBtnActive]} onPress={() => setPaymentMethod('Online')}><Text style={styles.catTextSmall}>Online</Text></TouchableOpacity></View>{paymentMethod === 'Online' && (<><Text style={{color: 'white', fontWeight: 'bold', marginBottom: 5}}>Online Payment Type:</Text><View style={{flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15}}>{onlineOptions.map(opt => (<TouchableOpacity key={opt} style={[styles.catBtnSmall, onlineMethod === opt && styles.catBtnActive]} onPress={() => setOnlineMethod(opt)}><Text style={styles.catTextSmall}>{opt}</Text></TouchableOpacity>))}</View></>)}<Text style={{color: 'white', fontWeight: 'bold', marginBottom: 5}}>Delivery Charge: ₹{deliveryCharge}</Text><Text style={{color: 'orange', fontSize: 18, fontWeight: 'bold', marginBottom: 15}}>Total: ₹{(selectedProduct? selectedProduct.price + deliveryCharge : 0).toLocaleString('en-IN')}</Text><TouchableOpacity style={styles.sendBtn} onPress={sendOrder}><Text style={styles.sendBtnText}>WhatsApp pe Order Bhejein</Text></TouchableOpacity><TouchableOpacity onPress={() => setShowOrderForm(false)}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity></View></View></Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  
  splashContainer: { flex:1, backgroundColor:'#2b1a0f', justifyContent:'center', alignItems:'center' },
  splashLogo: { width:200, height:200, resizeMode:'contain', borderRadius:20 },
  splashTitle: { color:'#d4a574', fontSize:32, fontWeight:'bold', marginTop:20, letterSpacing:1 },
  splashSub: { color:'#d4a574', fontSize:14, marginTop:5 },

  loginTitle: { fontSize: 40, fontWeight: 'bold', color: 'orange', textAlign: 'center', marginTop: 100 },
  loginSub: { fontSize: 16, color: 'gray', textAlign: 'center', marginBottom: 40 },
  loginBtn: { backgroundColor: 'orange', padding: 16, borderRadius: 10, alignItems: 'center', marginTop: 10, marginHorizontal:15 },
  loginBtnText: { color: 'black', fontWeight: 'bold', fontSize: 18 },
  cancel: { color: 'gray', textAlign: 'center', marginTop: 12 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#111' },
  logo: { fontSize: 24, fontWeight: 'bold', color: 'orange' },
  headerIcons: { flexDirection: 'row' },
  iconBtn: { marginLeft: 15 },

  searchBox: { backgroundColor: '#1a1a1a', flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 12, margin:15 },
  searchInput: { flex: 1, color: 'white', marginLeft: 10, fontSize: 15 },

  locationBar: { flexDirection:'row', alignItems:'center', backgroundColor:'#1a1a1a', padding:12, marginHorizontal:15, borderRadius:10, marginBottom:15 },
  locationText: { color:'white', flex:1, marginLeft:8 },

  catScroll: { paddingLeft:15, marginBottom:20 },
  catCircleWrap: { alignItems:'center', marginRight:15 },
  catCircle: { width:70, height:70, borderRadius:35, backgroundColor:'#1a1a1a', justifyContent:'center', alignItems:'center' },
  catEmoji: { fontSize:30 },
  catCircleText: { color:'white', fontSize:12, marginTop:5 },

  sectionTitle: { color:'white', fontSize:20, fontWeight:'bold', paddingHorizontal:15, marginBottom:10 },

  gridCard: { backgroundColor: '#1a1a1a', borderRadius: 12, margin: 6, width: '47%', padding: 10, marginLeft:10 },
  heartBtn: { position: 'absolute', top: 15, right: 15, zIndex: 10 },
  productImg: { width: '100%', height: 120, borderRadius: 10, marginBottom: 8 },
  productImgEmpty: { width: '100%', height: 120, borderRadius: 10, backgroundColor: '#2a2a2a', marginBottom: 8 },
  name: { fontSize: 14, fontWeight: 'bold', color: 'white' },
  price: { fontSize: 15, color: 'orange', fontWeight: 'bold', marginTop: 4 },
  orderBtn: { backgroundColor: '#25D366', padding: 10, borderRadius: 8, marginTop: 8, alignItems: 'center' },
  orderBtnText: { color: 'white', fontWeight: 'bold', fontSize: 13 },

  bottomNav: { flexDirection:'row', justifyContent:'space-around', paddingVertical:10, backgroundColor:'#111', borderTopWidth:1, borderTopColor:'#222' },
  navText: { color:'gray', fontSize:12, textAlign:'center' },

  adminTitle: { fontSize: 22, fontWeight: 'bold', color: 'white', margin:15 },
  input: { backgroundColor: '#1a1a1a', color: 'white', padding: 14, borderRadius: 10, marginBottom: 12, fontSize: 15, marginHorizontal:15 },
  catRowSmall: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15, paddingHorizontal:15 },
  catBtnSmall: { backgroundColor: '#1a1a1a', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, marginRight: 8, marginBottom: 8 },
  catBtnActive: { backgroundColor: 'orange' },
  catTextSmall: { color: 'white', fontWeight: 'bold', fontSize: 14 },
  addBtn: { backgroundColor: 'orange', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 15, marginHorizontal:15 },
  addBtnText: { color: 'black', fontWeight: 'bold', fontSize: 18 },
  
  adminCard: { backgroundColor: '#1a1a1a', padding: 12, borderRadius: 8, marginBottom: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginHorizontal:15 },
  small: { color: 'gray', fontSize: 12 },
  delete: { color: 'red', fontWeight: 'bold', fontSize: 15 },
  
  logoutBtnBig: { backgroundColor:'red', padding:15, borderRadius:10, alignItems:'center', marginTop:20 },
  logoutBtnText: { color:'white', fontWeight:'bold', fontSize:16 },
  catListItem: { backgroundColor:'#1a1a1a', padding:15, marginHorizontal:15, marginBottom:10, borderRadius:10 },
  catListText: { color:'white', fontSize:16 },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.9)', justifyContent: 'center', padding: 20 },
  modal: { backgroundColor: '#1a1a1a', padding: 20, borderRadius: 15 },
  modalTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalProduct: { color: 'orange', fontSize: 16, marginBottom: 15 },
  sendBtn: { backgroundColor: '#25D366', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  sendBtnText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});