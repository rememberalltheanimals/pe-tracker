CREATE TABLE counts (
 id SERIAL PRIMARY KEY,
 praise_counts INT NOT NULL
 criticize_counts INT NOT NULL
);

INSERT INTO counts (praise_counts) VALUES ('praise');

INSERT INTO counts (criticize_counts) VALUES ('criticize');

