<template>
    <button :class="classes" @click="$emit('click')"><slot></slot></button>
</template>

<style scoped>
button {
    border-radius: 6px;
    border: none;
    padding: 10px;
    font-family: 'Sniglet';
    transition: all 0.2s;
    white-space: nowrap;
}

.none:hover {
    background: rgba(0, 0, 0, 0.1);
}

.blue {
    background-color: #3DC2F7;
    color: #F7F7FF;
}

.blue:hover {
    background-color: rgb(49, 159, 202);
}

.pink {
    background-color: #EA526F;
    color: #F7F7FF;
}
.pink:hover {
    background-color: rgb(190, 67, 89);
}

.small {
    font-size: 0.7em;
}

.medium {
    font-size: 1em;
}

.large {
    font-size: 2em;
}
</style>

<script>
export default {
    props: ['size', 'type'],
    computed: {
        classes() {
            return {
                medium: this.size == 'medium' || !this.size,

                // colors
                none: !this.type,
                blue: this.type === 'blue',
                pink: this.type === 'pink',

                // other sizes
                small: this.size == 'small',
                large: this.size == 'large',
            };
        }
    }
}
</script>