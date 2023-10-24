<template>
    <!-- Header Section Begin -->
    <HeaderSection />
    <!-- Header Section End -->
   <!-- Product section-->
   <section class="py-5 my-4">
    <div class="container px-4 px-lg-5 my-5">
      <div class="row gx-4 gx-lg-5 align-items-center">
        <div class="col-md-6">
          <img class="card-img-top mb-5 mb-md-0"
            :src="item_list.image" alt="..." /></div>
        <div class="col-md-6">
          <h1 class="fs-1 fw-bold"> {{ item_list.deal_name }} </h1>
          <h3 class="fs-2 mb-4 fw-bold customColour"> ${{ item_list.deal_price }}</h3>
          <p class="fs-6 mb-4">
            {{ item_list.deal_description }}
          </p>
          <div class="fs-6 mb-3" v-if="item_list.uploaded_by">
            <i class="fa fa-building-o"></i>
            Store: <br> {{ item_list.uploaded_by.name }}
          </div>
          <div class="fs-6 mb-4">
            <i class="fa fa-map-marker"></i>
            Address: <br>{{ item_list.location }}
          </div>
          <div class="d-flex" v-if="$store.state.user && item_list.uploaded_by">
            <input class="form-control text-center me-3" id="inputQuantity" type="num" value="1"
              style="max-width: 3rem" v-if="item_list.uploaded_by.type=='store'" />
            <button class="btn btn-outline-dark flex-shrink-0" type="button" v-if="item_list.uploaded_by.type=='store'" >
              <i class="fa fa-shopping-cart"></i>
              Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- Related items section-->
  <section class="py-5 bg-light">
    <div class="container px-4 px-lg-5 mt-5">
      <h2 class="fw-bolder mb-4">Related products</h2>
      <div class="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
        <div class="col mb-5">
          <div class="card h-100">
            <!-- Product image-->
            <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
              <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">Fancy Product</h5>
                <!-- Product price-->
                $40.00 - $80.00
              </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">View options</a></div>
            </div>
          </div>
        </div>
        <div class="col mb-5">
          <div class="card h-100">
            <!-- Sale badge-->
            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale
            </div>
            <!-- Product image-->
            <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
              <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">Special Item</h5>
                <!-- Product reviews-->
                <div class="d-flex justify-content-center small text-warning mb-2">

                </div>
                <!-- Product price-->
                <span class="text-muted text-decoration-line-through">$20.00</span>
                $18.00
              </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
            </div>
          </div>
        </div>
        <div class="col mb-5">
          <div class="card h-100">
            <!-- Sale badge-->
            <div class="badge bg-dark text-white position-absolute" style="top: 0.5rem; right: 0.5rem">Sale
            </div>
            <!-- Product image-->
            <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
              <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">Sale Item</h5>
                <!-- Product price-->
                <span class="text-muted text-decoration-line-through">$50.00</span>
                $25.00
              </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
            </div>
          </div>
        </div>
        <div class="col mb-5">
          <div class="card h-100">
            <!-- Product image-->
            <img class="card-img-top" src="https://dummyimage.com/450x300/dee2e6/6c757d.jpg" alt="..." />
            <!-- Product details-->
            <div class="card-body p-4">
              <div class="text-center">
                <!-- Product name-->
                <h5 class="fw-bolder">Popular Item</h5>
                <!-- Product reviews-->
                <div class="d-flex justify-content-center small text-warning mb-2">
                </div>
                <!-- Product price-->
                $40.00
              </div>
            </div>
            <!-- Product actions-->
            <div class="card-footer p-4 pt-0 border-top-0 bg-transparent">
              <div class="text-center"><a class="btn btn-outline-dark mt-auto" href="#">Add to cart</a></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
 
 </template>
 
 <script>
 import HeaderSection from '../components/headerSection.vue';
 import  { storage, db } from '../firebase/index.js'
 import {doc, getDoc } from "firebase/firestore"
 import {ref, getDownloadURL } from "firebase/storage"
 
 export default {
    components: {
        HeaderSection
    },
    data() {
    return {
      item_list:{}
    };
  },
  created () {
    this.getdealitem()
  },
  methods: {
    async getdealitem(){
      const docRef = doc(db, "deals", this.$route.params.id);
      const docSnap = (await getDoc(docRef)).data()
      this.item_list = docSnap
      this.item_list.image = await this.generateImgUrl(this.$route.params.id,this.item_list.image,this.item_list.uploaded_by.email)
    },
    async generateImgUrl(dealId,dealImg,uploadEmail) {
            try {
                const url = await getDownloadURL(ref(storage, `deals/${uploadEmail}/${dealId}/${dealImg}`));
                return url;
            } catch (error) {
                console.error("Error fetching image URL:", error);
                return ""; // Return a default value or handle errors gracefully
            }
        }
  }
 };
 
 </script>

<style scoped>

img {
  width: 100%;
}
.customColour {
  color: #E97D2F
}
</style>
 
 
 
  
 
    