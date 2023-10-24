<template >
    <HeaderSection/>
    <main class="login" v-if="$store.state.authIsReady" >
        <section class="forms">

            <form class="register" @submit.prevent="register">
                <h2>Register</h2>
                <input type="email" placeholder="Email Address" v-model="register_form.email" />
                <input type="password" placeholder="Password" v-model="register_form.password" />
                <input type="submit" value="Register" />
            </form>

            <form class="login" @submit.prevent="login">
                <h2>Login</h2>
                <input type="email" placeholder="Email Address" v-model="login_form.email" />
                <input type="password" placeholder="Password" v-model="login_form.password" />
                <input type="submit" value="Login" />
            </form>

        </section>
    </main>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex';
import  HeaderSection from "../components/headerSection.vue"

export default {
    components: {
        HeaderSection
    },
    setup(){
        const login_form = ref({});
        const register_form = ref({});
        const store = useStore();

        const login = () => {
            store.dispatch('login', login_form.value)
        }

        const register = () => {
            store.dispatch('register', register_form.value)
        }

        return {
            login_form,
            register_form,
            login,
            register
        }
    }

}
</script>

<style scoped>
.forms {
    display: flex;
    min-height: 100vh;
}

form {
    flex: 1 1 0%;
    padding: 8rem 1rem 1rem;
}

form.register {
    color: white;
    background-color: rgb(245,66,101);
    background-image: linear-gradient(
        to bottom right,
        rgb(245, 66, 101) 0%,
        r(189, 28,60) 100%
    );
}

form.login {
    background-color: lightgray ;
}

h2 {
    text-transform: uppercase;
    margin-bottom: 2rem;
    text-align: center;
}

input {
    appearance: none;
    border: none;
    outline: none;
    background: none;

    display:block;
    width:100%;
    font-size: 1.5 rem;
    margin: 10px;
    padding: 10px;
}

input:not([type="submit"]){
    opacity: 0.8;
    transition: 0.4s;

}

input:focus:not([type=submit]){
    opacity: 1;
}

input::placeholder{
    color: inherit;
}

form.register input:not([type="submit"]){
    color: white;
    border-bottom: 1px solid #fff;
    max-width: 500px;
    margin: auto;

}

form.login input:not([type="submit"]){
    color: #2c3e50;
    border-bottom: 1px solid #2c3e50;
    max-width: 500px;
    margin: auto;
}

form.login input[type="submit"]{
    background-color: rgb(245, 66, 101);
    color: white;
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    text-transform: uppercase;
    max-width: 300px;
    margin: 20px auto;
}

form.register input[type="submit"]{
    background-color: white;
    color: rgb(245, 66, 101);
    font-weight: 700;
    padding: 1rem 2rem;
    border-radius: 0.5rem;
    cursor: pointer;
    text-transform: uppercase;
    max-width: 300px;
    margin: 20px auto;
}

</style>