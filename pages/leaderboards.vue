<template>
    <div>
        <table class="leaderboards-table">
            <thead>
                <th>User</th>
                <th>WPM</th>
                <th>KPM</th>
                <th>Accuracy</th>
                <th>Tests</th>
            </thead>
            <tbody>
                <tr v-for="user in leaderboards" :key="user.displayName">
                    <td>{{ user.displayName }}</td>
                    <td>{{ user.wpm }}</td>
                    <td>{{ user.kpm }}</td>
                    <td>{{ user.accuracy }}</td>
                    <td>{{ user.numOfTests }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.leaderboards-table {
    text-align: center;
    width: 100%;
}
</style>

<script>
export default {
    async asyncData({ $axios }) {
        const leaderboards = await $axios.get('https://us-central1-clickclack-f540e.cloudfunctions.net/getLeaderboards')
            .then((response) => response.data);

        return {
            leaderboards,
        };
    },
}
</script>