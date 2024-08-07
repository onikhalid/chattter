
    
    
    
    
    const getPosts = async () => {
        const postsCollectionRef = collection(db, "posts");
      // start fetching

      const getQuery = query(postsCollectionRef, where('postType', '==', currentPost), orderBy("createdAt", 'desc'), limit(postsPerFetch))
        
        // when user is signed in but doesn't follow anyone/ their followees😅 haven't posted anything
        else if (user && followedUserIds?.length < 1 && (currentwhosePost === "Following")) {
          setLoadingPosts(false)
          return null
        }
        else if (user && followedUserIds?.length > 0 && (currentwhosePost === "Following")) {
          return query(postsCollectionRef, where('postType', '==', currentPost), where('authorId', 'in', followedUserIds), orderBy("createdAt", 'desc'), limit(postsPerFetch));
        }
        // when user isn't signed in and wants to see posts from their imaginary followed user
        else if (!user && (currentwhosePost === "Following")) {
          return null
        }
      }


      const q = await getQuery();
      if (q == null) {
        setAllPosts([])
        return
      }
      else {
        const unsubscribe = onSnapshot(q, (snapshot) => {
          const newDataArray = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            newDataArray.push(data);
          });


          setAllPosts(newDataArray)
          const documents = snapshot.docs;
          setfetchedPosts(documents[documents.length - 1])
          setLoadingPosts(false)
        });
        return unsubscribe;
      }
    };

    try {
      getPosts();
    } catch (error) {
      if (error.code === "failed-precondition") {
        toast.error("Poor internet connection")
      }
      else if (error.code === "auth/network-request-failed" || "unavailable") {
        toast.error("There appears to be a problem with your connection", {
          position: "top-center"
        })
      }
      else if (error.message.includes('Backend didn\'t respond' || "[code=unavailable]")) {
        toast.error("There appears to be a problem with your connection", {
          position: "top-center"
        })
      }

    }

