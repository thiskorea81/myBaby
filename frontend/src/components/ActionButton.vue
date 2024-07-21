<template>
    <button @click="handleClick">{{ label }}</button>
  </template>
  
  <script>
  export default {
    name: 'ActionButton',
    props: {
      label: {
        type: String,
        required: true
      },
      onClick: {
        type: Function,
        required: true
      }
    },
    methods: {
      handleClick() {
        this.onClick();
      }
    }
  };
  </script>
  
  <style scoped>
  button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
  }
  </style>
  