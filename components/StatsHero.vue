<template>
    <div class="hero">
        <h1 class="text-6xl text-center">WPM<br>{{ wpm || 0 }}</h1>
        <h1 class="text-6xl text-center">KPM<br>{{ kpm || 0  }}</h1>
        <h1 class="text-6xl text-center">Accuracy<br>{{ accuracy || 0  }}%</h1>
        <h1 class="text-6xl text-center">Errors<br>{{ errors || 0 }}</h1>
        <h1 class="text-6xl text-center">Time<br>{{ time || '0:00' }}</h1>
    </div>
</template>

<style scoped>
.hero {
    width: 100%;
    background: linear-gradient(to right, #a76f58, #3a7086);
    padding: 60px;
    color: #F7F7FF;
    font-size: 2em;
    font-family: 'Sniglet';
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
}

.hero h1 {
    text-shadow: 0 0 10px #545451;
}

</style>

<script>

export default {
    props: ['wpm' ,'kpm', 'accuracy', 'errors', 'time'],
}
</script>
