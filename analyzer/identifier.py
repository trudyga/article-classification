import pandas as pd
import numpy as np
from nltk.tokenize import word_tokenize
from nltk import pos_tag
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from sklearn.preprocessing import LabelEncoder
from collections import defaultdict
from nltk.corpus import wordnet as wn
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn import model_selection, naive_bayes, svm
from sklearn.metrics import accuracy_score

from os import listdir
from os.path import isfile, join, abspath

import requests

np.random.seed(5000)

suicidePath = abspath("./resources/articles/suicide")
generalPath = abspath("./resources/articles/general")

endpoint = 'http://localhost:5000/article'


class Identifier():
    def __init__(self):
        suicideArticles = self.getSuicideArticles()
        generalArticles = self.getGeneralArticles()

        clearedSuicideArticles = [requests.post(
            endpoint, data={'text': a}).text for a in suicideArticles]
        clearedGeneralArticles = [requests.post(
            endpoint, data={'text': a}).text for a in generalArticles]

        # clearedSuicideArticles = suicideArticles
        # clearedGeneralArticles = generalArticles

        self.suicideArticles = suicideArticles
        self.generalArticles = generalArticles

        text = clearedSuicideArticles + clearedGeneralArticles
        label = (['suicide'] * len(clearedSuicideArticles)) + \
            (['general'] * len(clearedGeneralArticles))
        self.articleDataFrame = pd.DataFrame({
            'text': text,
            'label': label
        })

    def getArticleFiles(self, path):
        onlyfiles = [f for f in listdir(
            path) if isfile(join(path, f))]

        return onlyfiles

    def getFileContent(self, path, f):
        file = open(join(path, f), 'r')
        data = file.read()

        return data

    def getSuicideArticles(self):
        files = self.getArticleFiles(suicidePath)

        articles = [self.getFileContent(suicidePath, f) for f in files]

        return articles

    def getGeneralArticles(self):
        files = self.getArticleFiles(generalPath)

        articles = [self.getFileContent(generalPath, f) for f in files]

        return articles


identifier = Identifier()


def trainModel(Corpus):
    Train_X, Test_X, Train_Y, Test_Y = model_selection.train_test_split(
        Corpus['text'], Corpus['label'], test_size=0.3, random_state=1)

    return [Train_X, Test_X, Train_Y, Test_Y]


[Train_X, Test_X, Train_Y, Test_Y] = trainModel(identifier.articleDataFrame)

Encoder = LabelEncoder()
Train_Y = Encoder.fit_transform(Train_Y)
Test_Y = Encoder.fit_transform(Test_Y)

Corpus = identifier.articleDataFrame

# print(Corpus['text'])
Tfidf_vect = TfidfVectorizer(max_features=5000)
Tfidf_vect.fit(Corpus['text'])
Train_X_Tfidf = Tfidf_vect.transform(Train_X)
Test_X_Tfidf = Tfidf_vect.transform(Test_X)

# print(Tfidf_vect.vocabulary_)

# print(Train_X_Tfidf)

# Train
# fit the training dataset on the NB classifier
Naive = naive_bayes.MultinomialNB()
Naive.fit(Train_X_Tfidf, Train_Y)
# predict the labels on validation dataset
predictions_NB = Naive.predict(Test_X_Tfidf)
# Use accuracy_score function to get the accuracy
print("Naive Bayes Accuracy Score -> ",
      accuracy_score(predictions_NB, Test_Y)*100)

# Classifier - Algorithm - SVM
# fit the training dataset on the classifier
SVM = svm.SVC(C=1.0, kernel='linear', degree=3, gamma='auto')
SVM.fit(Train_X_Tfidf, Train_Y)
# predict the labels on validation dataset
predictions_SVM = SVM.predict(Test_X_Tfidf)
# Use accuracy_score function to get the accuracy
print("SVM Accuracy Score -> ", accuracy_score(predictions_SVM, Test_Y)*100)
