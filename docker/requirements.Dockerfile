FROM python:3.7-slim

COPY ./requirements.txt /tmp
COPY ./x-requirements.txt /tmp

RUN apt-get update                                                             && \
    apt-get install -y gcc make build-essential git                            && \
    python -m pip install --upgrade --force-reinstall pip==.20.2.1             && \
    pip install --no-cache-dir -r /tmp/requirements.txt                        && \
    python -m pip install spaCy --upgrade                                      && \
    python -m spacy download pt_core_news_lg                                   && \
    pip install --use-feature=2020-resolver --no-cache-dir -r /tmp/x-requirements.txt                      && \
    python -c "import nltk; nltk.download(['stopwords', 'rslp', 'punkt']);"    && \
    find . | grep -E "(__pycache__|\.pyc|\.pyo$)" | xargs rm -rf               && \
    apt-get clean                                                              && \
    apt-get remove -y build-essential
