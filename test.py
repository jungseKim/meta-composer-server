import sys
import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
import math
import json


Sonata = int(sys.argv[2])
Etudes = int(sys.argv[3])
Waltzes = int(sys.argv[4])
Nocturnes = int(sys.argv[5])
Marches = int(sys.argv[6])

genre = [[Sonata,Etudes,Waltzes,Nocturnes,Marches]
    ,[1,1,1,1,1]
]


genre_pd = pd.DataFrame(genre, columns=['Sonata','Etudes','Waltzes','Nocturnes','Marches']
,index=['usera','compare'])



genre_transpose = genre_pd.transpose()


# https://scikit-learn.org/stable/modules/metrics.html#cosine-similarity

# cosine-similarity


genre_similarity = cosine_similarity(genre_transpose,genre_transpose)


# #이때, 코사인 similaryity 함수를 통해 리턴되는값은

# # kernel matrix == 가중치 행렬

# # https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise.cosine_similarity.html


genre_similarity_pd = pd.DataFrame(data = genre_similarity, index = genre_pd.columns, columns = genre_pd.columns)

ratings_pred = genre_similarity_pd.dot(genre_similarity_pd) / np.array([np.abs(genre_similarity_pd).sum(axis=1)])

# print(ratings_pred)

def predict_rating(rating, similarity):
    ratings_pred = rating.dot(similarity) / np.array([np.abs(similarity).sum(axis=1)])
    return ratings_pred

# -1 ~ 1

ratings_pred = predict_rating(genre_pd.values, genre_similarity_pd.values)


ratings_pred_matrix = pd.DataFrame(data=ratings_pred, index=genre_pd.index,
                                  columns = genre_pd.columns)



def user_recommend(username):
    result_arr = ratings_pred_matrix.loc[username]
    result = np.array(result_arr)
    result.tolist()
    return result

recommend_np =user_recommend('usera')

genre_list = ['Sonata','Etudes','Waltzes','Nocturnes','Marches']

recommend_array = recommend_np.tolist()

final_result = [recommend_array,genre_list]

dictionary = dict(zip(recommend_np, genre_list))

# https://scikit-learn.org/stable/modules/generated/sklearn.metrics.pairwise_distances.html#sklearn.metrics.pairwise_distances

# distance

json_data = json.dumps(dictionary)

def send(json_data):
    print(json_data)


send(json_data)


sys.stdout.flush()