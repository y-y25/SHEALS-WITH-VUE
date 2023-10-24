<template>
	<!-- Offcanvas Menu Overlay -->
	<div class="offcanvas-menu-overlay" :class="{ 'show-offcanvas-menu-wrapper': isMenuOpen }"></div>

	<!-- Canvas Open Button -->
	<div class="canvas-open" @click="toggleMenu">
		<i class="icon_menu"></i>
	</div>

	<!-- Offcanvas Menu Wrapper -->
	<div class="offcanvas-menu-overlay" :class="{ 'active': isMenuOpen }"></div>
	<div class="offcanvas-menu-wrapper" :class="{ 'show-offcanvas-menu-wrapper': isMenuOpen }">
		<!-- Canvas Close Button -->
		<div class="canvas-close" @click="toggleMenu">
			<i class="icon_close"></i>
		</div>

		<!-- Search Icon -->
		<form action="" class="p-1 bg-light rounded-pill shadow-sm mb-5">
			<!-- Search Form -->
			<div class="input-group">
				<div class="input-group-prepend">
					<span class="input-group-text border-0 bg-light">
						<button id="button-addon1" type="submit" class="btn btn-link text-primary">
							<i class="fa fa-search"></i>
						</button>
					</span>
				</div>
				<input type="search" placeholder="Search" aria-describedby="button-addon1"
					class="form-control border-0 bg-light">
				<div class="input-group-append">
					<span class="input-group-text border-0 bg-light">
						<button id="button-addon1" type="submit" class="btn btn-link text-primary">
							<i class="fa fa-search"></i>
						</button>
					</span>
				</div>
			</div>
		</form>

		<!-- Header Configure Area -->
		<div class="header-configure-area">
			<a href="#" class="cart">
				<span><i class="fa fa-shopping-cart"></i>Checkout Discounts</span>
			</a>

			<!-- Notifications -->
			<a href="#" class="notification">
				<span><i class="fa fa-bell-o"></i>Notifications</span>
				<span class="badge">3</span>
			</a>

			<!-- Profile Option -->
			<div class="profile-option">
				<span>
					<i class="fa fa-user-o"></i>
					Profile
				</span>

				<!-- Profile Dropdown -->
				<div class="profile-dropdown">
					<ul>
						<li><a href="#">Login</a></li>
						<li><a href="#">Register</a></li>
					</ul>
				</div>
			</div>
		</div>

		<!-- <nav class="mainmenu mobile-menu">
		  <ul>
			  <li><a href="./bestDeals.html">Best Deals</a></li>
			  <li><a href="./bySupermarkets.html">By Supermarkets</a></li>
			  <li><a href="./byCommunity.html">By Community</a></li>
		  </ul>
	  </nav> -->
		<div id="mobile-menu-wrap"></div>
	</div>
	<!-- Offcanvas Menu Section End -->

	<!-- Header Section Begins -->
	<header class="header-section header-normal fixed-top">
		<!-- Top Navigation -->
		<div class="top-nav">
			<div class="container">
				<div class="row">
					<!-- Left Section -->
					<div class="col-lg-6">
						<ul class="tn-left">
							<!-- Logo -->
							<li class="col-lg-2">
								<!-- <a href="../about"> -->
								<router-link :to="{ name: 'Home' }">
									<img src="/img/logo.png" alt="Logo">
								</router-link>
								<!-- </a> -->
							</li>

							<!-- Search Form -->
							<li>
								<form action="">
									<div class="p-1 bg-light rounded rounded-pill shadow-sm" style="height: 40px">
										<div class="input-group">
											<div class="input-group-prepend">
												<span class="input-group-text border-0 bg-light">
													<button id="button-addon1" type="submit"
														class="btn btn-link text-primary">
														<i class="fa fa-search"></i>
													</button>
												</span>
											</div>
											<input type="search" placeholder="Search" aria-describedby="button-addon1"
												class="form-control border-0 bg-light">
											<div class="input-group-append">
												<span class="input-group-text border-0 bg-light">
													<button id="button-addon1" type="submit"
														class="btn btn-link text-primary">
														<i class="fa fa-search"></i>
													</button>
												</span>
											</div>
										</div>
									</div>
								</form>
							</li>
						</ul>
					</div>

					<!-- Right Section -->
					<div class="col-lg-6">
						<div class="tn-right">
							<!-- Checkout Discounts -->
							<a href="#" class="cart" v-if="$store.state.user">
								<span><i class="fa fa-shopping-cart"></i>Checkout Discounts</span>
							</a>
							<router-link :to="{ name: 'Login' }" v-if="!$store.state.user" class="profile-option">
								<span><i class="fa fa-user-o"></i>Login/Register </span>
							</router-link>

							<!-- Notifications -->
							<!-- <a href="#" class="notification">
						<span><i class="fa fa-bell-o"></i>Notifications</span>
						<span class="badge">3</span>
					</a> -->

							<!-- Profile Option -->
							<div class="profile-option" v-if="$store.state.user">
								<span>
									<i class="fa fa-user-o"></i>
									Profile
								</span>

								<!-- Profile Dropdown -->
								<div class="profile-dropdown">
									<ul>
										<li><span @click="$store.dispatch('logout')">Logout</span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Menu Item Section -->
		<div class="menu-item" v-if="$route.name !== 'Login'">
			<div class="container">
				<div class="row">
					<div class="col-lg-12">
						<div class="nav-menu">
							<!-- Main Navigation -->
							<nav class="mainmenu">
								<ul>
									<li class="active">
										<router-link :to="{ name: 'Home' }">
											<i class="fa fa-money custom-size-icon"></i>
											<span>Best Deals</span>
										</router-link>
									</li>
									<li>
										<a href="./bySupermarkets.html">
											<i class="fa fa-shopping-basket custom-size-icon"></i>
											<span>By Supermarkets</span>
										</a>
									</li>
									<li>
										<a href="./byCommunity.html">
											<i class="fa fa-users custom-size-icon"></i>
											<span>By Community</span>
										</a>
									</li>
									<li>
										<a href="./byCommunity.html">
											<i class="fa fa-heart custom-size-icon"></i>
											<span>Favourites</span>
										</a>
									</li>
								</ul>
							</nav>

							<!-- Filter Modal Component -->
							<button @click="openModal" class="filter-button">
								<i class="fa fa-sliders custom-size-icon"></i>
								<span>Filter</span>
							</button>

							<!-- Filter Modal Open -->
							<div v-if="showModal" class="modal-container">
								<div class="modal-background" @click="closeModal"></div>
								<div class="modal-content">
									<div class="modal-header">
										<h4 class="modal-title">Filters</h4>
										<button type="button" class="close" @click="closeModal">
											<span aria-hidden="true">&times;</span>
										</button>
									</div>

									<!-- price slider -->
									<div class="modal-body fs-5 py-3"> Select your categories: </div>

									<!-- category filter -->
									<div class="container-fluid">
										<div class="row">
											<div class="categoryFilter col-md-3 mb-2" v-for="cat in categoryList">
												<input type="checkbox" :id="cat" :value="cat" v-model="selectedCategories">
												<label class="btn btn-outline-dark" :for="cat">{{ cat }}</label>
											</div>
										</div>
									</div>

									<!-- below codes are for checking selected categories are captured -->
									<!-- <br>
									  <strong>You have chosen: </strong> {{ selectedCategories }}
									  <strong>Items in chosen category(s)</strong> -->

									<div>
										<button class="btn btn-outline-dark my-3 custom-btn-width-L" @click="applyFilter">Apply
											Filter</button>
										<button class="btn btn-outline-dark my-3 custom-btn-width-R" @click="resetFilter">Clear
											Selection</button>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</header>
</template>
  
<script>

export default {
	emits: ['filter-applied'],
	data() {
		return {
			isMenuOpen: false,
			showModal: false,
			selectedCategories: [],
			categoryList: ['Bakery', 'Beer, Wine & Spirits', 'Diary, Chilled & Eggs', 'Drinks',
				'Food Cupboard', 'Frozen', 'Fruits', 'Meat & Seafood',
				'Pet Supplies', 'Rice, Noodles & Cooking Ingredients',
				'Snacks & Confectionery', 'Vegetables']
		};
	},
	methods: {
		toggleMenu() {
			this.isMenuOpen = !this.isMenuOpen;
		},
		openModal() {
			this.showModal = true;
		},
		closeModal() {
			this.showModal = false;
		},
		applyFilter() {
			console.log('Applying filter with categories:', this.selectedCategories);
			this.$emit('filter-applied', this.selectedCategories);
			this.closeModal();
		},
		resetFilter() {
			this.selectedCategories = []; // Reset selectedCategories to an empty array
		},
	},
};
</script>
  
<style scoped>
/* Header Section Styling */

.header-section {
	font-family: "Cabin", sans-serif;
}
.header-section .header-normal .menu-item {
	-webkit-box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	box-shadow: 0px 12px 15px rgba(36, 11, 12, 0.05);
	z-index: 1000;
	display: flex;
	display: block;

}

.top-nav {
	border-bottom: 1px solid #e5e5e5;
	background-color: white;
	/* padding-top: 25px; */
}

.top-nav ul {
	margin-bottom: 0;

}

.top-nav .tn-left li {
	list-style: none;
	display: inline-block;
	font-size: 16px;
	color: #19191a;
	font-weight: 500;
	margin-right: 64px;
	position: relative;
	line-height: normal;
	padding: 8px 0px 6px;
}

.top-nav .tn-left li:after {
	position: absolute;
	right: -32px;
	top: 0;
	width: 1px;
	height: 100%;
	background: #e5e5e5;
	content: "";
}

.top-nav .tn-left .fa-search {
	color: #696969;
}


.top-nav .tn-left li #button-addon1 {
	padding: 0px;
}

.top-nav .tn-left li:last-child {
	margin-right: 0;
}

.top-nav .tn-left li:last-child:after {
	display: none;
}

.top-nav .tn-right {
	text-align: right;
}

.cart {
	padding: 20px 16px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	color: #393939;
}

.cart:hover {
	background: rgb(229, 229, 229);
}

.cart i {
	font-size: large;
	margin-right: 5px;
}

.notification {
	padding: 20px 25px 20px 16px;
	position: relative;
	display: inline-block;
	cursor: pointer;
	text-decoration: none;
	color: #393939;
}

.notification:hover {
	background: rgb(229, 229, 229);
}

.notification i {
	font-size: large;
	margin-right: 5px;
}

.notification .badge {
	position: absolute;
	top: 5px;
	border-radius: 50%;
	background: red;
	color: white;
}

.profile-option {
	padding: 20px 16px;
	display: inline-block;
	cursor: pointer;
	position: relative;
	color: #393939;
}

.profile-option:hover {
	background: rgb(229, 229, 229)
}

.profile-option i {
	font-size: large;
	margin-right: 1px;
}

.profile-option:hover .profile-dropdown {
	top: 65px;
	opacity: 1;
	visibility: visible;
}

.profile-option .profile-dropdown {
	position: absolute;
	left: 0;
	width: 95px;
	background: #ffffff;
	display: block;
	padding: 10px;
	-webkit-box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	box-shadow: 0px 9px 10px rgba(25, 25, 26, 0.2);
	opacity: 0;
	visibility: hidden;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
	z-index: 99;
}

.profile-option .profile-dropdown ul {
	padding-left: 15px;
}

.profile-option .profile-dropdown ul li {
	list-style: none;
	text-align: left;
}

.profile-option .profile-dropdown ul li a {
	font-size: 14px;
	text-transform: uppercase;
	font-weight: 500;
	text-decoration: none;
	color: #19191a;
	-webkit-transition: all 0.3s;
	-o-transition: all 0.3s;
	transition: all 0.3s;
}

/* orange font colour when hover */
.profile-option .profile-dropdown ul li a:hover {
	color: #E97D2F;
}

/* Menu Section */
.menu-item {
	display: flex;
	justify-content: space-between;
	background-color: white;

}

.nav-menu {
	display: flex;
	/* Align menu items in the same row */
}

.mainmenu {
	justify-content: left;
	/* Add space between menu and filter button */
	list-style: none;
	display: flex;
	/* Display list items horizontally */
	margin: 0;
	padding: 0;
}

/* Menu Section: nav menu (left) */
.menu-item .nav-menu {
	text-align: left;
	padding-top: 10px;
}

.menu-item .nav-menu .mainmenu {
	display: flex;
	/* Display list items horizontally */
	margin: 0;
	padding: 0;
}

.menu-item .nav-menu .mainmenu li {
	list-style: none;
	display: inline-block;
	position: relative;
	margin-right: 42px;
}

.menu-item .nav-menu .mainmenu li a {
	font-size: 16px;
	text-decoration: none;
	color: #808080;
	/* Grey color for inactive state */
	font-weight: 500;
	display: grid;
	place-items: center;
	/* Center both horizontally and vertically */
	padding: 10px 0;
	position: relative;
	transition: all 0.3s;
}

.menu-item .nav-menu .mainmenu li a i {
	color: #808080;
	/* Grey color for inactive state */
	margin-bottom: 5px;
	/* Adjust the spacing between icon and text */
}

.menu-item .nav-menu .mainmenu li a:after {
	position: absolute;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 2px;
	background: #E97D2F;
	content: "";
	opacity: 0;
	transition: all 0.3s;
}

.menu-item .nav-menu .mainmenu li.active a,
.menu-item .nav-menu .mainmenu li a:hover {
	color: #000000;
	/* Black color for active or hovered state */
}

.menu-item .nav-menu .mainmenu li.active a i,
.menu-item .nav-menu .mainmenu li a:hover i {
	color: #000000;
	/* Black color for active or hovered state */
}

.menu-item .nav-menu .mainmenu li a:hover:after,
.menu-item .nav-menu .mainmenu li.active a:after {
	opacity: 1;
	background: #E97D2F;
	/* Yellow color for active state */
}

.menu-item .nav-menu i {
	color: #808080;
	/* Grey color for inactive state */
	cursor: pointer;
}

.menu-item .nav-menu .custom-size-icon {
	font-size: 1.4em;
	color: #808080;
	/* Grey color for inactive state */
}

/* End of Menu Section: nav menu (left) */


/* Off Menu Canvas Styles */

@media only screen and (min-width: 1300px) {
	.container {
		max-width: 1300;
	}
}

@media only screen and (max-width: 991px) {
	.top-nav {
		display: none;
	}

	.menu-item .nav-menu {
		display: none;
	}

	.offcanvas-menu-overlay {
		position: fixed;
		left: 0;
		top: 0;
		background: rgba(0, 0, 0, 0.7);
		z-index: 98;
		height: 100%;
		width: 100%;
		visibility: hidden;
		-webkit-transition: 0.3s;
		-o-transition: 0.3s;
		transition: 0.3s;
	}

	.offcanvas-menu-overlay.active {
		visibility: visible;
	}

	.canvas-open {
		position: absolute;
		right: 40px;
		top: 25px;
		font-size: 22px;
		width: 30px;
		height: 30px;
		color: #19191a;
		border: 1px solid #19191a;
		border-radius: 2px;
		line-height: 33px;
		text-align: center;
		z-index: 100;
		display: block;
		cursor: pointer;
	}

	.offcanvas-menu-wrapper {
		position: fixed;
		left: -300px;
		top: 0;
		width: 300px;
		z-index: 999;
		background: #ffffff;
		text-align: center;
		overflow-y: auto;
		height: 100%;
		opacity: 0;
		visibility: hidden;
		-webkit-transition: all 0.5s;
		-o-transition: all 0.5s;
		transition: all 0.5s;
		padding: 80px 30px 30px 30px;
		display: block;
	}

	.offcanvas-menu-wrapper .canvas-close {
		height: 30px;
		width: 30px;
		border: 1px solid #19191a;
		border-radius: 50%;
		text-align: center;
		line-height: 30px;
		cursor: pointer;
		position: absolute;
		right: 30px;
		top: 30px;
		padding-right: 1px;
	}

	.offcanvas-menu-wrapper .header-configure-area {
		margin-bottom: 30px;
		text-align: left;
	}


	.offcanvas-menu-wrapper .mainmenu {
		display: none;
	}

	.offcanvas-menu-wrapper.show-offcanvas-menu-wrapper {
		left: 0;
		opacity: 1;
		visibility: visible;
	}
}

/*---------------------
    Filter Button
    -----------------------*/
.filter-button {
	font-size: 16px;
	font-weight: 500;
	display: flex;
	align-items: center;
	cursor: pointer;
	background-color: #ffffff;
	margin-left: auto;
	/* Push the filter button to the right */
	border: 1.5px solid #e5e5e5;
	/* Grey border color */
	border-radius: 25px;
	/* Rounded corners */
	height: 50px;
	/* Set a maximum height for the content */
	padding: 15px;
	/* Adjust padding as needed */
	margin-top: 10px;

}

.filter-button i {
	color: #393939;
	margin-right: 5px;
	/* Adjust spacing between icon and text */
	padding: 0px;
}

/*---------------------
    Modal
    -----------------------*/
.modal-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	font-family: "Cabin", sans-serif;
}

.modal-background {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	/* Semi-transparent black background */
}

.modal-content {
	border-radius: 35px;
	background-color: #fff;
	padding: 10px 30px 15px 30px;
	max-width: 600px;
	overflow-y: auto;
	box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
	z-index: 1000;
	/* Ensure it's above other elements */
}

.modal-header {
	display: flex;
	border-bottom: 1px solid #e0e0e0;
}

.close {
	/* display: flex; */
	background: none;
	border: none;
	cursor: pointer;
	font-size: 40px;
	color: #333;
}

/*---------------------
    Inline Checkboxes
    -----------------------*/
.modal-body {
	display: block;
	width: 100%;
}

.modal-body .row {
	margin-bottom: 10px;
	/* display: flex; */
}

.categoryFilter {
	padding: 0px;
	margin: 0px;
}

.categoryFilter input {
	display: none;
	/* Hide the actual checkboxes */
}

.categoryFilter label {
	/* border: 1.5px solid #e5e5e5; */
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

/* Style for checked checkboxes */
.categoryFilter input:checked+label {
	background-color: rgb(40, 40, 40);
	color: white;
}

.btn {
	font-weight: 500;
	border-radius: 25px;
	cursor: pointer;
	border-width: 1.5px;

}
.categoryFilter .btn {
	transition: background-color 0.3s, color 0.3s;
	width: 130px;
	/* Set a fixed width for the button */
	height: 120px;
	/*Set a fixed height for the button  */
}

.custom-btn-width-R {
	width: 48%;
	margin-left: 1%;
}

.custom-btn-width-L {
	background-color: #19191a;
	color: white;
	width: 48%;
	margin-right: 1%;
}</style>
  