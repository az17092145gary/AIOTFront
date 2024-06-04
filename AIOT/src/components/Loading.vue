<template>
    <div id="loadingdiv">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
</template>
<style scoped>
#loadingdiv {
    position: fixed;
    /* 将元素固定在视窗中 */
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}
.overlay {
    z-index: 9999;
}

.spinner-border {
    z-index: 10000;
}</style>
