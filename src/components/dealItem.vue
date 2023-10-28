<!-- roomItem.vue, receives room details through props which is from roomData --> 
<template>
    <!-- preloader -->
    <div v-if="loading" id="preloader">
        <!-- Preloader -->
        <div class="loader"></div>
    </div>
    <div v-for="deal in display_list" :key="deal.id" class="col-lg-3 col-md-6" >
        <!-- bind each deal object in the array to the deal prop of the dealItem component. -->
        <router-link :to="{ name: 'item-detail', params: { id: deal.id } }">
            <div class="room-box">
                <div class="room-item">
                    <img :src="deal.image" alt="">
                    <div class="ri-text">
                        <h4>{{ deal.deal_name }}</h4>
                        <h3>${{ deal.deal_price }}<span>/Perunit</span></h3>
                        <table>
                            <tbody>
                                <tr>
                                    <td class="r-o1">Store:</td>
                                    <td class="r-o2">{{ deal.uploaded_by.name }}</td>
                                </tr>
                                <tr>
                                    <td class="r-o1">Address:</td>
                                    <td class="r-o2">{{ deal.location }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div class="heart-button" @click.prevent="toggleHeart(deal.id)">
                        <i
                            :class="{ 'fa': true, 'fa-heart': isFavourite(deal.id), 'fa-heart-o': !isFavourite(deal.id) }"></i>
                    </div>
                </div>
            </div>
        </router-link>
    </div>
</template>
  
<script>
//import router from '../router/index.js';  // Import router instance
import { db } from '../firebase/index.js'
import { collection, getDocs } from "firebase/firestore"

export default {
    props: {
        deal: Object,
        deals: Array,
        selectedCategories: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            loading: true, // initially show preloader
            favourites: [], //Initialize favorites as an empty array
            deal_list: [], // Initialize deal_list as an empty array
            display_list: [], // Initialize display_list as an empty array

        }
    },
    //trigger function before mounted
    created() {
        this.fetchDeals()
    },
    watch: {
        // Watch for changes in selectedCategories
        selectedCategories: {
            handler: 'updateDisplayList',
            immediate: true, // Execute the handler immediately on component creation
            deep: true, // Watch for changes in the array's elements
        },
    },
    methods: {
        toggleHeart(dealBarcode) {
            // Toggle the favorite status for the given item barcode
            const index = this.favourites.indexOf(dealBarcode);
            console.log('Toggle Heart - dealBarcode:', dealBarcode, 'Index:', index);
            if (index === -1) {
                // Add to favorites
                this.favourites.push(dealBarcode);
            } else {
                // Remove from favorites
                this.favourites.splice(index, 1);
            }
            console.log('Updated Favourites:', this.favourites);
        },
        isFavourite(dealBarcode) {
            // Check if the item is in favorites
            return this.favourites.includes(dealBarcode);
        },
        async fetchDeals() {
            // show preloader before fetching data
            this.loading = true;
            
            const querySnapshot = await getDocs(collection(db, "deals"));
            const deal_list = [];

            for (const doc of querySnapshot.docs) {
                const obj = doc.data();
                obj['id'] = doc.id;
                deal_list.push(obj);
            }
            this.deal_list = deal_list;  //assign the populated deal_list to the deal_list property of component:
            this.display_list = deal_list; // initially set display_list to all deals
            this.loading = false; // stop preloader

            // Call the method to update the display list based on selected categories after fetching deals
            this.updateDisplayList();
        },

        async updateDisplayList() {
            // If no categories are selected, show all deals
            if (this.selectedCategories.length === 0) {
                this.display_list = this.deal_list;
            } else {
                // Filter deals based on selected categories
                const filteredDeals = this.deal_list.filter(deal =>
                    this.selectedCategories.includes(deal.product_category)
                );
                this.display_list = filteredDeals;
            }
            console.log('Display List:', this.display_list);
        },

    },
    mounted() {
        console.log(this.deal);
    }
}


</script>
  
<style scoped>
::v-deep a {
    text-decoration: none;
}

.room-box {
    border-radius: 15px;
    overflow: hidden;
    display: block;
    font-family: "Cabin", sans-serif;
}

.room-item {
    margin-bottom: 30px;
    position: relative;
}

.room-item img {
    min-width: 100%;
    border-top-right-radius: 15px;
    border-top-left-radius: 15px;
    max-height: 290px;
    /* Adjust the value as needed */
    object-fit: cover;
    /* This property ensures the image retains its aspect ratio while covering the specified height */

}

.room-item .ri-text {
    border: 1px solid #ebebeb;
    border-top: none;
    border-bottom-right-radius: 15px;
    border-bottom-left-radius: 15px;
    padding: 24px;
}

.room-item .ri-text h4 {
    color: #19191a;
    margin-bottom: 10px;
    font-size: 20px;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

}

.room-item .ri-text h3 {
    font-size: 24px;
    color: #E97D2F;
    font-weight: bold;
    margin-bottom: 10px;
}

.room-item .ri-text h3 span {
    font-size: 15px;
    font-weight: 400;
    color: #19191a;
}

.room-item .ri-text table tbody tr td {
    font-size: 15px;
    color: #707079;
    line-height: 20px;
}

.room-item .ri-text table tbody tr td.r-o1 {
    width: 80px;
}

.room-item .ri-text table tbody tr td.r-o2 {
    max-width: 60px;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    /* add an ellipsis (...) if the text overflows */
    white-space: nowrap;
    /* prevents the text from wrapping to the next line */
}

.heart-button {
    position: absolute;
    top: 12px;
    /* Adjust the position as needed */
    right: 18px;
    /* Adjust the position as needed */
    font-size: 30px;
    /* Increased font size for better visibility */
    z-index: 1;
    /* Ensure the heart is above the image */
    background: none;
    border: none;
    cursor: pointer;
}

.fa-heart {
    -webkit-text-stroke: 0.3x rgb(212, 42, 42);
    /* Add a red outline */
    color: rgb(212, 42, 42);
}

.fa-heart-o {
    color: white;
}
</style>

  