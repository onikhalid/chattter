    // try {

    //   const getArchivedPosts = async () => {




    //       const foldersCollectionRef = collection(db, "folders");
    //       const foldersQuery = query(foldersCollectionRef, where('userId', '==', currentUser))
    //       onSnapshot(foldersQuery, (snapshot) => {
    //         const folders = []
    //         snapshot.forEach((doc) => {
    //           const data = doc.data();
    //           folders.push(data);
    //         });
    //         setUserFolders(folders)
    //       });


    //       const bookmarksCollectionRef = collection(db, "bookmarks");
    //       const bookmarksQuery = query(bookmarksCollectionRef, where('userId', '==', currentUser))
    //       onSnapshot(bookmarksQuery, (snapshot) => {
    //         const bookmarks = []
    //         snapshot.forEach((doc) => {
    //           const data = doc.data();
    //           bookmarks.push(data);
    //         });
    //         setUserBookmarks(bookmarks)
    //       });
    //     }
    //   };

    //   getArchivedPosts();
    //   setLoadingPosts(false)
    // }
    // catch (error) {
    //   if (error.code === "unavailable") {
    //     toast.error("You seem to be offline, connect to the internet and try again", {
    //       position: "top-center",
    //       autoClose: 2500
    //     })
    //   } else {
    //     console.log(error)
    //   }
    // }
    // return () => { }
