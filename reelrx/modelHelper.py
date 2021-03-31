import pandas as pd
import numpy as np
import json
import requests

from scipy.sparse import csr_matrix
from sklearn.neighbors import NearestNeighbors
from config import api_key

import matplotlib.pyplot as plt
import seaborn as sns

import pickle

class ModelHelper():
    def __init__(self):
        self.movies = pd.read_csv("data/movies.csv", sep='\t')
        self.ratings = pd.read_csv("data/ratings.csv", sep='\t')
        self.no_user_voted = self.ratings.groupby('movie_id')['rating'].agg('count')
        self.no_movies_voted = self.ratings.groupby('user_id')['rating'].agg('count')
        self.final_dataset = self.ratings.pivot(index='movie_id',columns='user_id',values='rating').fillna(0)
        # self.final_dataset = self.final_dataset.loc[:,self.no_movies_voted[self.no_movies_voted > 10].index]
        self.movie_listings = self.movies.join(self.no_user_voted,on='movie_id').sort_values('rating', ascending=False)
        self.movie_listings['year'] = self.movie_listings['title'].map(lambda x: str(x)[len(str(x))-6:])
        self.movie_listings['title'] = self.movie_listings['title'].map(lambda x: str(x)[:-7])
        self.movie_listings['user_votes'] = self.movie_listings['rating']
        self.movie_listings = self.movie_listings.drop(columns=['Unnamed: 0','genres','movie_id','rating']).fillna(0)

    def getRecDetails(self, rec_name):
        genre = self.movies.loc[self.movies['title']==rec_name,:]['genres'].values[0]
        changetoinput = rec_name[:-7]
        rec_title = rec_name[:-7]
        year = rec_name[-6:]
        if changetoinput[-5:] == ", The":
            changetoinput = changetoinput[:-5]
            rec_title = "The "+changetoinput
        if changetoinput[-3:] == ", A":
            changetoinput = changetoinput[:-3]
            rec_title = "A "+changetoinput
        movie_input = changetoinput+year[1:5]
        url = f"https://api.themoviedb.org/3/search/movie?api_key={api_key}&query={changetoinput}"
        response = requests.get(url)
        print(response.status_code)
        data = response.json()
        print(data)
        tmdb_id = 0
        if response.status_code ==200:
            for x in data["results"]:
                # if 'release_date' in data['results'][0].keys():
                    if x["release_date"]=="":
                        x["release_date"]="1100"
                    if x["title"][:4] == "The ":
                        results_title = x["title"][4:]+x["release_date"][:4]
                    elif x["title"][:2] == "A ":
                        results_title = x["title"][2:]+x["release_date"][:4]
                    else:
                        results_title = x["title"]+x["release_date"][:4]
                    print(results_title)

                    if results_title == movie_input:
                        
                        tmdb_id = x['id']
                        break
                        print("success")
                    results_title = results_title[:-4]+str(int(results_title[-4:])-1)
                    print(results_title)
                    if results_title == movie_input:
                        
                        tmdb_id = x['id']
                        break
                        print("success")
                    results_title = results_title[:-4]+str(int(results_title[-4:])-1)
                    print(results_title)
                    if results_title == movie_input:
                        
                        tmdb_id = x['id']
                        break
                        print("success")
                    results_title = results_title[:-4]+str(int(results_title[-4:])+3)
                    print(results_title)
                    if results_title == movie_input:
                        
                        tmdb_id = x['id']
                        break
                        print("success") 
                    results_title = results_title[:-4]+str(int(results_title[-4:])+1)
                    print(results_title)
                    if results_title == movie_input:
                        
                        tmdb_id = x['id']
                        break
                        print("success")  

        print(movie_input)
        print(tmdb_id)
        rent_list = []
        stream_list = []
        buy_list = []
        rec_details_list = []
        if tmdb_id == 0:
            stream_list.append("Unknown")
            rent_list.append("Unknown")
            buy_list.append("Unknown")
            rec_details_list = ["https://www.themoviedb.org/assets/2/v4/logos/v2/blue_square_2-d537fb228cf3ded904ef09b136fe3fec72548ebc1fea3fbbd1ad9e36364db38b.svg",rec_title,year,"",genre,"Please use search bar for more information",stream_list,rent_list,buy_list]
            return rec_details_list
        else:
            url2 = f"https://api.themoviedb.org/3/movie/{tmdb_id}?api_key={api_key}&language=en-US&include_image_language=en,null"
            response2 = requests.get(url2)
            print(response2.status_code)
            data2 = response2.json()
            url3 = f"https://api.themoviedb.org/3/movie/{tmdb_id}/watch/providers?api_key={api_key}"
            response3 = requests.get(url3)
            print(response3.status_code)
            data3 = response3.json()
            print(data3)
            if 'US' in data3['results'].keys():

                if 'rent' in data3['results']['US'].keys():
                    for x in data3['results']['US']['rent']:
                        rent_list.append(x['provider_name'])
                if 'flatrate' in data3['results']['US'].keys():
                    for x in data3['results']['US']['flatrate']:
                        stream_list.append(x['provider_name'])
                if 'buy' in data3['results']['US'].keys():
                    for x in data3['results']['US']['buy']:
                        buy_list.append(x['provider_name'])
            
            poster = data2['poster_path']
            poster_image = f"https://image.tmdb.org/t/p/w500{poster}"
            overview = data2['overview']
            runtime = str(data2['runtime'])+" minutes"
        
            rec_details_list.append(poster_image)
            rec_details_list.append(rec_title)
            rec_details_list.append(year)
            rec_details_list.append(runtime)
            rec_details_list.append(genre)
            rec_details_list.append(overview)
            rec_details_list.append(stream_list)
            rec_details_list.append(rent_list)
            rec_details_list.append(buy_list)
            return rec_details_list

    
    def getMoviesList(self,movie_name):
        empty = pd.DataFrame()
        if len(movie_name) > 3:
            self.movie_listings['looking']=self.movie_listings['title'].map(lambda x: str(x)[:len(movie_name)])
            self.movie_listings['looking']=self.movie_listings['looking'].str.lower()
            #return self.movie_listings.loc[self.movie_listings['looking']==movie_name.lower()].head(5)
            search_list = self.movie_listings.loc[self.movie_listings['looking']==movie_name.lower()].head(5)
            search_list = search_list.drop(columns=['looking','user_votes'])
            return search_list
        else:
            return empty


    def makePredictions(self, movie_name, obscure):

        filename = 'finalized_model.sav'
        knn_load = pickle.load(open(filename, 'rb'))
                
        n_movies_to_recommend = 5
        movie_list = self.movies[self.movies['title'].str.contains(movie_name)]  
        if len(movie_list):        
            temp_dataset = []
            function_dataset =[]
            movie_idx= movie_list.iloc[0]['movie_id']
            if obscure == True:
                #temp_dataset = final_dataset.loc[:,no_movies_voted[(no_movies_voted > 50)].index]
                temp_dataset = self.final_dataset.loc[self.no_user_voted[(self.no_user_voted > 1) & (self.no_user_voted <= 23)].index,:]
                function_dataset = self.final_dataset.loc[movie_idx,:]
                function_dataset = temp_dataset.append(function_dataset)
                function_dataset.fillna(0,inplace=True)
#             sample = np.array([[0,0,3,0,0],[4,0,0,0,2],[0,0,0,0,1]])
#             sparsity = 1.0 - ( np.count_nonzero(sample) / float(sample.size) )
#             csr_sample = csr_matrix(sample)
                csr_data = csr_matrix(function_dataset.values)
                function_dataset.reset_index(inplace=True)
            else:
                #temp_dataset = final_dataset.loc[:,no_movies_voted[no_movies_voted > 50].index]
                temp_dataset = self.final_dataset.loc[self.no_user_voted[self.no_user_voted > 23].index,:]
                function_dataset = self.final_dataset.loc[movie_idx,:]
                function_dataset = temp_dataset.append(function_dataset)
                function_dataset.fillna(0,inplace=True)
                # sample = np.array([[0,0,3,0,0],[4,0,0,0,2],[0,0,0,0,1]])
                # sparsity = 1.0 - ( np.count_nonzero(sample) / float(sample.size) )
                # csr_sample = csr_matrix(sample)
                csr_data = csr_matrix(function_dataset.values)
                function_dataset.reset_index(inplace=True)

        
            knn_load.fit(csr_data)
            movie_idx = function_dataset[function_dataset['movie_id'] == movie_idx].index[0]
        
            distances , indices = knn_load.kneighbors(csr_data[movie_idx],n_neighbors=51)    
            rec_movie_indices = sorted(list(zip(indices.squeeze().tolist(),distances.squeeze().tolist())),\
                               key=lambda x: x[1])[:0:-1]
            recommend_frame = []
        
            for val in rec_movie_indices:
                movie_idx = function_dataset.iloc[val[0]]['movie_id']
                idx = self.movies[self.movies['movie_id'] == movie_idx].index
                recommend_frame.append({'Title':self.movies.iloc[idx]['title'].values[0],'Distance':val[1]})
            df = pd.DataFrame(recommend_frame,index=range(0,50))
            return df.head(n_movies_to_recommend)
    
        else:
        
            return "No movies found. Please check your input"


       