<script setup lang="ts">
import { RouterView } from 'vue-router';
import NotificationContainer from '../components/NotificationContainer.vue';
import ConfirmationDialog from '../components/ConfirmationDialog.vue';
import Navbar from '../components/Navbar.vue';
</script>

<template>
  <Navbar />
  <RouterView />
  <NotificationContainer />
  <ConfirmationDialog />
</template>
