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
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix

from os import listdir
from os.path import isfile, join, abspath

import requests

np.random.seed(5000)


class Identifier():
    def __init__(self, suicideFilesPath, generalFilesPath, preprocessorEndpoint):
        self.suicidePath = suicideFilesPath
        self.generalPath = generalFilesPath
        suicideArticles = self.getSuicideArticles()
        generalArticles = self.getGeneralArticles()

        clearedSuicideArticles = [requests.post(
            preprocessorEndpoint, data={'text': a}).text for a in suicideArticles]
        clearedGeneralArticles = [requests.post(
            preprocessorEndpoint, data={'text': a}).text for a in generalArticles]

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
        files = self.getArticleFiles(self.suicidePath)

        articles = [self.getFileContent(self.suicidePath, f) for f in files]

        return articles

    def getGeneralArticles(self):
        files = self.getArticleFiles(self.generalPath)

        articles = [self.getFileContent(self.generalPath, f) for f in files]

        return articles

    def splitTrainSet(self, Corpus):
        Train_X, Test_X, Train_Y, Test_Y = model_selection.train_test_split(
            Corpus['text'], Corpus['label'], test_size=0.3, random_state=1)

        return [Train_X, Test_X, Train_Y, Test_Y]

    def vectorizeText(self, text):
        # Vectorized transform accepts array of documents by default
        return self.vectorizer.transform([text])

    def train(self, articleDataFrame):
        [Train_X, Test_X, Train_Y, Test_Y] = self.splitTrainSet(
            articleDataFrame)

        Encoder = LabelEncoder()
        Train_Y = Encoder.fit_transform(Train_Y)
        Test_Y = Encoder.fit_transform(Test_Y)

        Corpus = articleDataFrame

        # print(Corpus['text'])
        # Create Vectorizer
        Tfidf_vect = TfidfVectorizer(max_features=5000)
        self.vectorizer = Tfidf_vect
        Tfidf_vect.fit(Corpus['text'])

        print(Test_X)
        Train_X_Tfidf = Tfidf_vect.transform(Train_X)
        Test_X_Tfidf = Tfidf_vect.transform(Test_X)

        # print(Tfidf_vect.vocabulary_)

        # print(Train_X_Tfidf)

        # Train
        # fit the training dataset on the NB classifier
        Naive = naive_bayes.MultinomialNB()
        Naive.fit(Train_X_Tfidf, Train_Y)
        # predict the labels on validation dataset
        print(Test_X_Tfidf)
        predictions_NB = Naive.predict(Test_X_Tfidf)

        self.Naive = Naive
        # Use accuracy_score function to get the accuracy
        self.Naive_accurasy_score = accuracy_score(predictions_NB, Test_Y)
        print("Naive Bayes Accuracy Score -> ",
              accuracy_score(predictions_NB, Test_Y)*100)
        print(confusion_matrix(Test_Y, predictions_NB))
        print(classification_report(Test_Y, predictions_NB))

        # Classifier - Algorithm - SVM
        # fit the training dataset on the classifier
        SVM = svm.SVC(C=1.0, kernel='linear', degree=3,
                      gamma='auto', probability=True)
        SVM.fit(Train_X_Tfidf, Train_Y)
        # predict the labels on validation dataset
        predictions_SVM = SVM.predict(Test_X_Tfidf)

        self.SVM = SVM
        # Use accuracy_score function to get the accuracy
        self.SVM_accuracy_score = accuracy_score(predictions_SVM, Test_Y)
        print("SVM Accuracy Score -> ",
              accuracy_score(predictions_SVM, Test_Y)*100)
        print(confusion_matrix(Test_Y, predictions_SVM))
        print(classification_report(Test_Y, predictions_SVM))

    def predictNaive(self, input, proba):
        return self.Naive.predict_proba(input) if proba == True else self.Naive.predict(input)

    def predictSVM(self, input, proba):
        return self.SVM.predict_proba(input) if proba == True else self.SVM.predict(input)
